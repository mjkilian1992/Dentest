import json
from rest_framework import status
from base_test_case import BaseQuestionAPITestCase
from questions.models import Question, Subtopic


class QuizTestCase(BaseQuestionAPITestCase):
    def setUp(self):
        super(QuizTestCase, self).setUp()
        s1 = Subtopic.objects.get(name='Subtopic 1')
        s2 = Subtopic.objects.get(name='Subtopic 2')
        s3 = Subtopic.objects.get(name='Subtopic 3')

        # Want 4 questions in s1, 3 questions in s2 and 1 in s3
        q1 = Question.objects.create(id=5,
                                     question='wjhdfjshfd',
                                     answer='Test',
                                     subtopic=s1,
                                     restricted=False)
        q2 = Question.objects.create(id=6,
                                     question='sdfsdfsdf',
                                     answer='sdfsdfsdf',
                                     subtopic=s1,
                                     restricted=True)
        q3 = Question.objects.create(id=7,
                                     question='sdgsdfsdfsdf',
                                     answer='Nopesdfsdfsf',
                                     subtopic=s2,
                                     restricted=True)
        q4 = Question.objects.create(id=8,
                                     question='Wsdfsdfsdfsdf',
                                     answer="sdfsdf",
                                     subtopic=s2,
                                     restricted=True)

    def test_quiz(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.premium_token.key)
        response = self.client.post('/quiz/',
                                    {'topic_list': [{'topic': 'Topic 1', 'subtopic': 'Subtopic 1'},
                                                    {'topic': 'Topic 1', 'subtopic': 'Subtopic 2'},
                                                    {'topic': 'Topic 2', 'subtopic': 'Subtopic 3'}
                                                    ],
                                     'max_questions': 6},
                                    format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = json.loads(response.content)

        counts = {
            'Subtopic 1':0,
            'Subtopic 2':0,
            'Subtopic 3':0,
        }
        for q in data:
            counts[q['subtopic']['name']] += 1
        self.assertEqual(counts['Subtopic 1'],3)
        self.assertEqual(counts['Subtopic 2'],2)
        self.assertEqual(counts['Subtopic 3'],1)
