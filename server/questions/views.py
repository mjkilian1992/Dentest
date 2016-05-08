import json
from itertools import chain
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from serializers import *
from subscriptions.customer_management import is_premium_user


class QuizView(APIView):
    '''
    Provide a list of topics and subtopics
    '''
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request,format=None):
        # Restrict access to paid users
        if not (is_premium_user(request.user) or self.request.user.is_staff):
            raise PermissionDenied

        # Get raw questions
        topic_list = request.data['topic_list']
        max_questions = int(request.data['max_questions'])

        # Catch empty topic list
        if len(topic_list) < 1:
            raise ValidationError("Topic list provided was empty")
        # Catch zero or negative max questions
        if max_questions < 1:
            raise ValidationError("Must have at least 1 question in a quiz")

        # Work out the max number of questions available in database per topic
        total_questions_available = 0
        questions_available_per_topic = []
        for topic in topic_list:
            subtopic = Subtopic.objects.get(topic=topic['topic'],name=topic['subtopic'])
            questions = Question.objects.filter(subtopic=subtopic)
            count = questions.count()
            total_questions_available += count
            questions_available_per_topic.append(count)

        # Now work out target number of questions per topic
        if total_questions_available < max_questions:
            max_questions = total_questions_available
            enough_questions_available = False

        target_questions_per_topic = max_questions / len(topic_list)

        # Redistribute based on limits
        # Reduce questions required for topics with too few questions
        questions_per_topic = [target_questions_per_topic] * len(topic_list)
        questions_left_to_assign = max_questions
        for index,questions_for_topic in enumerate(questions_per_topic):
            if questions_per_topic[index] > questions_available_per_topic[index]:
                questions_per_topic[index] = questions_available_per_topic[index]
            questions_left_to_assign -=  questions_per_topic[index]

        # Now try to add questions for other topics
        while questions_left_to_assign > 0:
            for index, qNo in enumerate(questions_per_topic):
                if qNo < questions_available_per_topic[index]:
                    questions_per_topic[index] += 1
                    questions_left_to_assign -= 1
                    if questions_left_to_assign == 0:
                        break;

        # Now combine topic list with questions for each
        topics_and_question_numbers = zip(topic_list,questions_per_topic)

        # build queryset
        queryset = []
        for topic,number_of_questions in topics_and_question_numbers:
            subtopic = Subtopic.objects.get(topic=topic['topic'],name=topic['subtopic'])
            questions = Question.objects.filter(subtopic=subtopic).order_by('?')
            queryset = list(chain(queryset, questions[0:number_of_questions]))

        serializer = QuestionSerializer(queryset, many=True)
        return Response(serializer.data)
