import json
from rest_framework import status
from base_test_case import BaseQuestionAPITestCase


class QuestionTestCase(BaseQuestionAPITestCase):
    def test_token_all_question_retrieval_unauthenticated(self):
        """Check an unauthenticated user can't access questions"""
        response = self.client.get('/questions/', format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_all_questions_retrieval_unprivileged(self):
        """Check a basic user can only access non-restricted questions"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/questions/', format='json')
        data = json.loads(response.content)
        self.assertEqual(data['count'],1) # User can only access the one unrestricted question
        data = data['results']
        self.assertFalse(data[0]['restricted'])
        self.assertEqual(str(data[0]['question']), 'What is my name?')
        self.assertEqual(str(data[0]['subtopic']['topic']), 'Topic 1')



    def test_token_all_question_retrieval_privileged(self):
        """Check a privileged user can access all questions"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.premium_token.key)
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
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
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
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.premium_token.key)
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
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/questions/', {'topic': 'Topic 1'}, format='json')
        data = json.loads(response.content)['results']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['subtopic']['topic'], 'Topic 1')
        self.assertEqual(data[0]['id'], 1)


    def test_token_fetch_by_topic_unprivileged_all_restricted(self):
        """If a topic exists, the user is restricted from viewing all its questions, 403 should be returned"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/questions/by_topic/Topic 2/', format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_token_fetch_by_topic_privileged(self):
        """Privileged user can view all questions in any topic"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.premium_token.key)
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
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/questions/by_topic/NonExistantTopic/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_token_fetch_empty_topic(self):
        """Filtering on an empty topic should also return 404 (no QUESTIONS could be found)"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/questions/by_topic/Topic 3/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_token_fetch_by_subtopic_unprivleged(self):
        """Basic users should only be able to see unrestricted questions"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/questions/by_subtopic/Topic 1/Subtopic 1/', format='json')
        data = json.loads(response.content)['results']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['subtopic']['topic'], 'Topic 1')
        self.assertEqual(data[0]['subtopic']['name'], 'Subtopic 1')
        self.assertEqual(data[0]['id'], 1)

    def test_token_fetch_by_subtopic_privilieged(self):
        """Privileged user can see all the questions in a subtopic"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.premium_token.key)
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
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/questions/by_subtopic/Topic 1/Subtopic 2/', format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_token_fetch_by_subtopic_unknown_subtopic(self):
        """If no such subtopic exists, should return 404"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/questions/by_subtopic/Topic 1/NonExistantSubtopic/',
                                   format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_token_fetch_by_subtopic_empty_subtopic(self):
        """If the subtopic is empty then 404 should be returned (no QUESTIONS found)"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/questions/by_subtopic/Topic 2/Subtopic 4/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_token_search_question(self):
        """Search should return some results if text matches"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.premium_token.key)

        # should only return one question
        response = self.client.get('/questions_search/Have I run out/',format='json')
        data = json.loads(response.content)['results']
        self.assertEqual(data[0]['question'],'Have I run out of questions?')
        self.assertEqual(len(data),1)

        # should return nothing
        response = self.client.get('/questions_search/BlaBlaBla1233:::/',format='json')
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)
