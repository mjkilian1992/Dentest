import json
from django.test import TestCase
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from models import *


class QuestionAPITokenAuthTestCase(TestCase):
    def setUp(self):
        # Create groups with name matching Privileged Groups
        self.bronze = Group(name='Bronze')
        self.bronze.save()
        self.silver = Group(name='Silver')
        self.silver.save()

        # Create one bronze, one silver and one staff user
        self.bronze_user = User.objects.create_user('test_token_bronze',
                                                    'bronze@fake.com',
                                                    'password1',
                                                    )
        self.bronze_user.groups.add(self.bronze)
        self.bronze_user.save()
        self.bronze_token, _ = Token.objects.get_or_create(user=self.bronze_user)

        self.silver_user = User.objects.create_user('test_token_silver',
                                                    'silver@fake.com',
                                                    'password2',
                                                    )
        self.silver_user.groups.add(self.silver)
        self.silver_user.save()
        self.silver_token, _ = Token.objects.get_or_create(user=self.silver_user)

        self.staff_user = User.objects.create_user('test_token_staff',
                                                   'staff@fake.com',
                                                   'password3',
                                                   )
        self.staff_user.is_staff = True
        self.staff_user.save()
        self.staff_token, _ = Token.objects.get_or_create(user=self.staff_user)

        # Create APIFactory and Client
        self.client = APIClient()

        # Populate database
        # Mixed
        t1 = Topic.objects.create(name='Topic 1', description='The first topic.')
        #Only restricted questions
        t2 = Topic.objects.create(name='Topic 2', description='The second topic.')
        #Empty
        t3 = Topic.objects.create(name='Topic 3', description='The third topic.')

        # Mixed
        s1 = Subtopic.objects.create(name='Subtopic 1',
                                     topic=t1,
                                     description='The first subtopic of topic 1.')
        # All restricted
        s2 = Subtopic.objects.create(name='Subtopic 2',
                                     topic=t1,
                                     description='The second subtopic of topic 1.')
        s3 = Subtopic.objects.create(name='Subtopic 3',
                                     topic=t2,
                                     description='The first subtopic of topic 2.')
        # Empty
        s4 = Subtopic.objects.create(name='Subtopic 4',
                                     topic=t2,
                                     description='The second subtopic of topic 2.')

        q1 = Question.objects.create(id=1,
                                     question='What is my name?',
                                     answer='Test',
                                     subtopic=s1,
                                     restricted=False)
        q2 = Question.objects.create(id=2,
                                     question='What app is this?',
                                     answer='Dentest_token',
                                     subtopic=s1,
                                     restricted=True)
        q3 = Question.objects.create(id=3,
                                     question='Have I run out of questions?',
                                     answer='Nope',
                                     subtopic=s2,
                                     restricted=True)
        q4 = Question.objects.create(id=4,
                                     question='What about now?',
                                     answer="Yeah, I've ran out...",
                                     subtopic=s3,
                                     restricted=True)

    def tearDown(self):
        # Destroy all database entities
        User.objects.all().delete()
        Group.objects.all().delete()
        Question.objects.all().delete()
        Subtopic.objects.all().delete()
        Topic.objects.all().delete()
        self.client = None


    def test_token_topic_retrieval_unauthenticated(self):
        """Check an unauthenticated user cant access Topics"""
        response = self.client.get('/topics/', format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_topic_retrieval_authenticated(self):
        """Check any authenticated user can access all topics"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/topics/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data['count'],3)
        self.assertTrue({'name': 'Topic 1', 'description': 'The first topic.'} in data['results'])
        self.assertTrue({'name': 'Topic 2', 'description': 'The second topic.'} in data['results'])


    def test_token_topic_submission_unauthenticated(self):
        """Test that an attempt to add a topic by an unauthenticated user fails"""
        topic_data = {'name': 'PostedTopic'}
        # Try with unauthenticated user (should fail)
        response = self.client.post('/topics/', topic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_topic_submission_non_staff(self):
        """Test that an attempt to add a topic by a non-staff user fails"""
        topic_data = {'name': 'PostedTopic'}
        # Try with bronze authenticated
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.post('/topics/', topic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


        #Try with silver authenticated
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.silver_token.key)
        response = self.client.post('/topics/', topic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_token_topic_submission_staff(self):
        """Check that staff can POST new topics"""
        topic_data = {'name': 'PostedTopic'}
        # Try with staff user
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.staff_token.key)
        response = self.client.post('/topics/', topic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Topic.objects.get(name='PostedTopic'))


    def test_token_single_topic_retrieval_unauthenticated(self):
        """Check that an unauthenticated user cannot access topics"""
        response = self.client.get('/topic/Topic 1/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue('detail' in data)

    def test_token_single_topic_retrieval_authenticated(self):
        """Check that an authenticated user can access a topic"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/topic/Topic 1/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data['name'],'Topic 1')
        self.assertEqual(data['description'],'The first topic.')






    def test_token_subtopic_retrieval_unauthenticated(self):
        """Check an unauthenticated user cant access Subtopics"""
        response = self.client.get('/subtopics/', format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_subtopic_retrieval_authenticated(self):
        """Check any authenticated user can access all Subtopics"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/subtopics/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(data['count'],4)
        # Ordering should be by Topic name, then Subtopic name
        # Returned value will be in unicode
        data = data['results']
        self.assertEqual(str(data[0]['name']), 'Subtopic 1')
        self.assertEqual(str(data[1]['name']), 'Subtopic 2')
        self.assertEqual(str(data[2]['name']), 'Subtopic 3')


    def test_token_subtopic_submission_unauthenticated(self):
        """Test that an attempt to add a subtopic by an unauthenticated user fails"""
        subtopic_data = {'name': 'PostedSubtopic',
                         'topic': 'Topic 1',
                         'description': 'A user posted subtopic.'}
        # Try with unauthenticated user (should fail)
        response = self.client.post('/subtopics/', subtopic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_subtopic_submission_non_staff(self):
        """Test that an attempt to add a subtopic by a non-staff user fails"""
        subtopic_data = {'name': 'PostedSubtopic',
                         'topic': 'Topic 1',
                         'description': 'A user posted subtopic.'}
        # Try with bronze authenticated
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.post('/subtopics/', subtopic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


        #Try with silver authenticated
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.silver_token.key)
        response = self.client.post('/topics/', subtopic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_token_subtopic_submission_staff(self):
        """Check that staff can POST new subtopics"""
        subtopic_data = {'name': 'PostedSubtopic',
                         'topic': 'Topic 1',
                         'description': 'A user posted subtopic.'}
        # Try with staff user
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.staff_token.key)
        response = self.client.post('/subtopics/', subtopic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subtopic.objects.get(name='PostedSubtopic'))

    def test_token_single_subtopic_retrieval_unauthenticated(self):
        """Check that an unauthenticated user cannot access topics"""
        response = self.client.get('/subtopic/Topic 1/Subtopic 1/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue('detail' in data)

    def test_token_single_subtopic_retrieval_authenticated(self):
        """Check that an authenticated user can access a topic"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/subtopic/Topic 1/Subtopic 1/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data['topic'],'Topic 1')
        self.assertEqual(data['name'],'Subtopic 1')
        self.assertEqual(data['description'],'The first subtopic of topic 1.')




    def test_token_all_question_retrieval_unauthenticated(self):
        """Check an unauthenticated user can't access questions"""
        response = self.client.get('/questions/', format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_all_questions_retrieval_unprivileged(self):
        """Check a basic user can only access non-restricted questions"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/questions/', format='json')
        data = json.loads(response.content)
        self.assertEqual(data['count'],1) # User can only access the one unrestricted question
        data = data['results']
        self.assertFalse(data[0]['restricted'])
        self.assertEqual(str(data[0]['question']), 'What is my name?')
        self.assertEqual(str(data[0]['subtopic']['topic']), 'Topic 1')



    def test_token_all_question_retrieval_privileged(self):
        """Check a privileged user can access all questions"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.silver_token.key)
        response = self.client.get('/questions/', format='json')
        data = json.loads(response.content)
        self.assertEqual(data['count'], 4)


    def test_token_all_question_retrieval_staff(self):
        """Check a staff member can access all questions"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.staff_token.key)
        response = self.client.get('/questions/', format='json')
        data = json.loads(response.content)
        self.assertEqual(data['count'], 4)


    def test_token_fetch_question_by_id_unauthenticated(self):
        """Check an unauthenticated user cant access individual questions"""
        response = self.client.get('/questions/question_number/1/',  format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_fetch_question_by_id_unprivileged(self):
        """An unprivileged user should only be able to access non-restricted questions"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        # Try on non-restricted question. Make sure only one is returned
        response = self.client.get('/questions/question_number/1/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data['id'], 1)

        # Now try a restricted question. Should fail
        response = self.client.get('/questions/question_number/2/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_token_fetch_question_by_id_privileged(self):
        """A privileged user can access any question"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.silver_token.key)
        response = self.client.get('/questions/question_number/2/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data['id'], 2)

    def test_token_fetch_question_by_id_staff(self):
        """A staff user can also access privileged questions"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.staff_token.key)
        response = self.client.get('/questions/question_number/2/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data['id'], 2)

    def test_token_fetch_by_topic_unauthenticated(self):
        """An unauthenticated user cant access anything"""
        response = self.client.get('/questions/by_topic/Topic 1/', format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_fetch_by_topic_unprivileged(self):
        """Basic user should only see the unrestricted questions in the topic"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/questions/', {'topic': 'Topic 1'}, format='json')
        data = json.loads(response.content)['results']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['subtopic']['topic'], 'Topic 1')
        self.assertEqual(data[0]['id'], 1)


    def test_token_fetch_by_topic_unprivileged_all_restricted(self):
        """If a topic exists, the user is restricted from viewing all its questions, 403 should be returned"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/questions/by_topic/Topic 2/', format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_token_fetch_by_topic_privileged(self):
        """Privileged user can view all questions in any topic"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.silver_token.key)
        response = self.client.get('/questions/by_topic/Topic 1/', format='json')
        data = json.loads(response.content)['results']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), 3)

        # Questions should always be ordered by Subtopic then ID
        self.assertEqual(data[0]['subtopic']['topic'], 'Topic 1')
        self.assertEqual(data[0]['id'], 1)
        self.assertEqual(data[1]['subtopic']['topic'], 'Topic 1')
        self.assertEqual(data[1]['id'], 2)


    def test_token_fetch_unknown_topic(self):
        """Filtering on a non existent topic should return a 404 error"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/questions/by_topic/NonExistantTopic/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_token_fetch_empty_topic(self):
        """Filtering on an empty topic should also return 404 (no QUESTIONS could be found)"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/questions/by_topic/Topic 3/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_token_fetch_by_subtopic_unprivleged(self):
        """Basic users should only be able to see unrestricted questions"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/questions/by_subtopic/Topic 1/Subtopic 1/', format='json')
        data = json.loads(response.content)['results']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['subtopic']['topic'], 'Topic 1')
        self.assertEqual(data[0]['subtopic']['name'], 'Subtopic 1')
        self.assertEqual(data[0]['id'], 1)

    def test_token_fetch_by_subtopic_privilieged(self):
        """Privileged user can see all the questions in a subtopic"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.silver_token.key)
        response = self.client.get('/questions/by_subtopic/Topic 1/Subtopic 1/', format='json')
        data = json.loads(response.content)['results']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['subtopic']['topic'], 'Topic 1')
        self.assertEqual(data[0]['subtopic']['name'], 'Subtopic 1')
        self.assertEqual(data[0]['id'], 1)
        self.assertEqual(data[1]['subtopic']['topic'], 'Topic 1')
        self.assertEqual(data[1]['subtopic']['name'], 'Subtopic 1')
        self.assertEqual(data[1]['id'], 2)

    def test_token_fetch_by_subtopic_unprivileged_all_restricted(self):
        """If all questions in the subtopic are restricted, 403 should be returned"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/questions/by_subtopic/Topic 1/Subtopic 2/', format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_token_fetch_by_subtopic_unknown_subtopic(self):
        """If no such subtopic exists, should return 404"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/questions/by_subtopic/Topic 1/NonExistantSubtopic/',
                                   format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_token_fetch_by_subtopic_empty_subtopic(self):
        """If the subtopic is empty then 404 should be returned (no QUESTIONS found)"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.bronze_token.key)
        response = self.client.get('/questions/by_subtopic/Topic 2/Subtopic 4/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_token_search_question(self):
        """Search should return some results if text matches"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.silver_token.key)

        # should only return one question
        response = self.client.get('/questions_search/Have I run out/',format='json')
        data = json.loads(response.content)['results']
        self.assertEqual(data[0]['question'],'Have I run out of questions?')
        self.assertEqual(len(data),1)

        # should return nothing
        response = self.client.get('/questions_search/BlaBlaBla1233:::/',format='json')
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)