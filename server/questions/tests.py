import json
from django.test import TestCase
from django.contrib.auth.models import User,Group
from rest_framework.test import APIClient
from rest_framework import status
from models import *

# Create your tests here.

class QuestionAPITestCase(TestCase):

    def setUp(self):
        # Create groups with name matching Privileged Groups
        self.bronze = Group(name='Bronze')
        self.bronze.save()
        self.silver = Group(name='Silver')
        self.silver.save()

        # Create one bronze, one silver and one staff user
        self.bronze_user = User.objects.create_user('test_bronze',
                                               'bronze@fake.com',
                                               'password1',
                                               )
        self.bronze_user.groups.add(self.bronze)
        self.bronze_user.save()

        self.silver_user = User.objects.create_user('test_silver',
                                               'silver@fake.com'
                                               'password2',
                                               )
        self.silver_user.groups.add(self.silver)
        self.silver_user.save()

        self.staff_user = User.objects.create_user('test_staff',
                                              'staff@fake.com',
                                              'password3',
                                              )
        self.staff_user.is_staff = True
        self.staff_user.save()

        # Create APIFactory and Client
        self.client = APIClient()

        # Populate database
        t1 = Topic.objects.create(name='Topic1',description='The first topic.')
        t2 = Topic.objects.create(name='Topic2',description='The second topic.')

        # Mixed
        s1 = Subtopic.objects.create(name='Subtopic 1',
                                     topic=t1,
                                     description='The first subtopic of topic 1.')
        # All restricted
        s2 = Subtopic.objects.create(name='Subtopic 2',
                                     topic=t1,
                                     description='The second subtopic of topic 1.')
        # Empty
        s3 = Subtopic.objects.create(name='Subtopic 3',
                                     topic=t2,
                                     description='The first subtopic of topic 2.')

        q1 = Question.objects.create(question='What is my name?',
                                     answer='Test',
                                     subtopic=s1,
                                     restricted=False)
        q2 = Question.objects.create(question='What app is this?',
                                     answer='Dentest',
                                     subtopic=s1,
                                     restricted=True)
        q3 = Question.objects.create(question='Have I run out of questions?',
                                     answer='Nope',
                                     subtopic=s2,
                                     restricted=True)
        q4 = Question.objects.create(question='What about now?',
                                     answer="Yeah, I've ran out...",
                                     subtopic = s2,
                                     restricted=True)

    def tearDown(self):
        #Destroy all database entities
        User.objects.all().delete()
        Group.objects.all().delete()
        Question.objects.all().delete()
        Subtopic.objects.all().delete()
        Topic.objects.all().delete()


    def test_topic_retrieval_unauthenticated(self):
        '''Check an unauthenticated user cant access Topics'''
        response = self.client.get('/topics/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

    def test_topic_retrieval_authenticated(self):
        '''Check any authenticated user can access all topics'''
        self.client.login(username='test_bronze',password='password1')
        response = self.client.get('/topics/',format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertTrue({'name': 'Topic1','description':'The first topic.'} in data)
        self.assertTrue({'name': 'Topic2','description':'The second topic.'} in data)


    def test_topic_submission_unauthenticated(self):
        '''Test that an attempt to add a topic by an unauthenticated user fails'''
        topic_data = {'name':'PostedTopic'}
        #Try with unauthenticated user (should fail)
        response = self.client.post('/topics/',topic_data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

    def test_topic_submission_non_staff(self):
        '''Test that an attempt to add a topic by a non-staff user fails'''
        topic_data = {'name':'PostedTopic'}
        #Try with bronze authenticated
        self.client.login(username='test_bronze',password='password1')
        response = self.client.post('/topics/',topic_data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.client.logout()

        #Try with silver authenticated
        self.client.login(email='silver@fake.com',password='password2')
        response = self.client.post('/topics/',topic_data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.client.logout()

    def test_topic_submission_staff(self):
        '''Check that staff can POST new topics'''
        topic_data = {'name':'PostedTopic'}
        # Try with staff user
        self.client.login(username='test_staff',password='password3')
        response = self.client.post('/topics/',topic_data,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertTrue(Topic.objects.get(name='PostedTopic'))
        self.client.logout()

    def test_subtopic_retrieval_unauthenticated(self):
        '''Check an unauthenticated user cant access Subtopics'''
        response = self.client.get('/subtopics/',format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

    def test_subtopic_retrieval_authenticated(self):
        '''Check any authenticated user can access all Subtopics'''
        self.client.login(username='test_bronze',password='password1')
        response = self.client.get('/subtopics/',format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        # Ordering should be by Topic name, then Subtopic name
        # Returned value will be in unicode
        self.assertEqual(str(data[0]['name']),'Subtopic 1')
        self.assertEqual(str(data[1]['name']),'Subtopic 2')
        self.assertEqual(str(data[2]['name']),'Subtopic 3')

    def test_subtopic_submission_unauthenticated(self):
        '''Test that an attempt to add a subtopic by an unauthenticated user fails'''
        subtopic_data={'name': 'PostedSubtopic',
                       'topic': 'Topic 1',
                       'description': 'A user posted subtopic.'}
        #Try with unauthenticated user (should fail)
        response = self.client.post('/subtopics/',subtopic_data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)

    def test_subtopic_submission_non_staff(self):
        '''Test that an attempt to add a subtopic by a non-staff user fails'''
        subtopic_data={'name': 'PostedSubtopic',
                       'topic': 'Topic 1',
                       'description': 'A user posted subtopic.'}
        #Try with bronze authenticated
        self.client.login(username='test_bronze',password='password1')
        response = self.client.post('/subtopics/',subtopic_data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.client.logout()

        #Try with silver authenticated
        self.client.login(email='silver@fake.com',password='password2')
        response = self.client.post('/topics/',topic_data,format='json')
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.client.logout()

    def test_topic_submission_staff(self):
        '''Check that staff can POST new subtopics'''
        subtopic_data={'name': 'PostedSubtopic',
                       'topic': 'Topic 1',
                       'description': 'A user posted subtopic.'}
        # Try with staff user
        self.client.login(username='test_staff',password='password3')
        response = self.client.post('/subtopics/',subtopic_data,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertTrue(Subtopic.objects.get(name='PostedSubtopic'))
        self.client.logout()




