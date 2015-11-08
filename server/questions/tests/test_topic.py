import json
from rest_framework import status
from base_test_case import BaseQuestionAPITestCase
from questions.models import *


class TopicTestCase(BaseQuestionAPITestCase):
    """Test operations on Topics"""
    
    def test_topic_retrieval_unauthenticated(self):
        """Check an unauthenticated user cant access Topics"""
        response = self.client.get('/topics/', format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_topic_retrieval_authenticated(self):
        """Check any authenticated user can access all topics"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/topics/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data['count'],3)
        self.assertTrue({'name': 'Topic 1', 'description': 'The first topic.'} in data['results'])
        self.assertTrue({'name': 'Topic 2', 'description': 'The second topic.'} in data['results'])


    def test_topic_submission_unauthenticated(self):
        """Test that an attempt to add a topic by an unauthenticated user fails"""
        topic_data = {'name': 'PostedTopic'}
        # Try with unauthenticated user (should fail)
        response = self.client.post('/topics/', topic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_topic_submission_non_staff(self):
        """Test that an attempt to add a topic by a non-staff user fails"""
        topic_data = {'name': 'PostedTopic'}
        # Try with free authenticated
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.post('/topics/', topic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


        #Try with premium authenticated
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.premium_token.key)
        response = self.client.post('/topics/', topic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_topic_submission_staff(self):
        """Check that staff can POST new topics"""
        topic_data = {'name': 'PostedTopic'}
        # Try with staff user
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.staff_token.key)
        response = self.client.post('/topics/', topic_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Topic.objects.get(name='PostedTopic'))


    def test_single_topic_retrieval_unauthenticated(self):
        """Check that an unauthenticated user cannot access topics"""
        response = self.client.get('/topic/Topic 1/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue('detail' in data)

    def test_single_topic_retrieval_authenticated(self):
        """Check that an authenticated user can access a topic"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.free_token.key)
        response = self.client.get('/topic/Topic 1/', format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data['name'],'Topic 1')
        self.assertEqual(data['description'],'The first topic.')





