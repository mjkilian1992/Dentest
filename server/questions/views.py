import json
from itertools import chain
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from serializers import *

class QuizView(APIView):
    '''
    Provide a list of topics and subtopics
    '''
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request,format=None):
        # Get raw questions
        topic_list = json.loads(request.data['topic_list'])
        max_questions = int(request.data['max_questions'])
        enough_questions_available = True

        # Work out the max number of questions available in database per topic
        total_questions_available = 0
        questions_available_per_topic = []
        for topic in topic_list:
            subtopic = Subtopic.objects.get(topic=topic.topic,subtopic=topic.subtopic)
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
        questions_per_topic = [target_questions_per_topic * len(topic_list)]
        questions_left_to_assign = max_questions
        for c in enumerate(questions_per_topic):
            index = c[0]
            questions_for_topic = c[1]
            if questions_per_topic > questions_available_per_topic:
                questions_per_topic[index] = questions_available_per_topic[index]
                questions_left_to_assign -=  questions_available_per_topic[index]

        # Now try to add questions for other topics
        while questions_left_to_assign > 0:
            for qNo in enumerate(questions_per_topic):
                if qNo[1] < questions_available_per_topic[qNo[0]]:
                    questions_per_topic[qNo[0]] += 1
                    questions_left_to_assign -= 1
                    if questions_left_to_assign == 0:
                        break;
            if questions_left_to_assign == 0:
                break;

        # Now combine topic list with questions for each
        topics_and_question_numbers = zip(topic_list,questions_per_topic)

        # build queryset
        queryset = []
        for t in topics_and_question_numbers:
            subtopic = Subtopic.objects.get(topic=t[1].topic,subtopic=t[1].subtopic)
            questions = Question.objects.filter(subtopic=subtopic).order_by('?')
            queryset = list(chain(queryset, questions[0:t[1]]))

        serializer = QuestionSerializer(queryset, many=True)
        return Response(serializer.data)