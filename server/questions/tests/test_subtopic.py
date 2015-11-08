import json
from rest_framework import status
from base_test_case import BaseQuestionAPITestCase
from questions.models import *


class SubtopicTestCase(BaseQuestionAPITestCase):
    def test_subtopic_retrieval_unauthenticated(self):
        """Check an unauthenticated user cant access Subtopics"""
        response = self.client.get('/subtopics/', format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_subtopic_retrieval_authenticated(self):
        """Check any authenticated user can access all Subtopics"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
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


    def test_subtopic_submission_unauthenticated(self):
        """Test that an attempt to add a subtopic by an unauthenticated user fails"""
        subtopic_data = {'name': 'PostedSubtopic',
                         'topic': 'Topic 1',
                         'description': 'A user posted subtopic.'}
        # Try with unauthenticated user (should fail)
        response = self.client.post('/subtopics/', subtopic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_subtopic_submission_non_staff(self):
        """Test that an attempt to add a subtopic by a non-staff user fails"""
        subtopic_data = {'name': 'PostedSubtopic',
                         'topic': 'Topic 1',
                         'description': 'A user posted subtopic.'}
        # Try with free authenticated
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.post('/subtopics/', subtopic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


        #Try with premium authenticated
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.premium_token.key)
        response = self.client.post('/topics/', subtopic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_subtopic_submission_staff(self):
        """Check that staff can POST new subtopics"""
        subtopic_data = {'name': 'PostedSubtopic',
                         'topic': 'Topic 1',
                         'description': 'A user posted subtopic.'}
        # Try with staff user
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.staff_token.key)
        response = self.client.post('/subtopics/', subtopic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subtopic.objects.get(name='PostedSubtopic'))

    def test_single_subtopic_retrieval_unauthenticated(self):
        """Check that an unauthenticated user cannot access topics"""
        response = self.client.get('/subtopic/Topic 1/Subtopic 1/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue('detail' in data)

    def test_single_subtopic_retrieval_authenticated(self):
        """Check that an authenticated user can access a topic"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/subtopic/Topic 1/Subtopic 1/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data['topic'],'Topic 1')
        self.assertEqual(data['name'],'Subtopic 1')
        self.assertEqual(data['description'],'The first subtopic of topic 1.')

