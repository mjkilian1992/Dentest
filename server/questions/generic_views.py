from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, ListAPIView
from rest_framework import permissions, status
from rest_framework.response import Response
from models import *
from serializers import *
from mixins import QuestionApiMixin
from pagination import *


class TopicView(ListCreateAPIView):

    serializer_class = TopicSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = ClientControllablePagination

    def get_queryset(self):
        return Topic.objects.all()

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied  # Need to raise forbidden if not staff member
        serializer.save()




class SubtopicView(ListCreateAPIView):
    serializer_class = SubtopicSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = ClientControllablePagination

    def get_queryset(self):
        return Subtopic.objects.all()

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied  # Need to raise forbidden if not staff member
        serializer.save()


class QuestionListCreateView(QuestionApiMixin, ListCreateAPIView):
    def get_queryset(self):
        '''
        Show restricted questions only to Silver+ users. Questions can be
        accessed individually by question number or filtered by subtopic
        :return:
        '''

        # No filtering. Just display all questions user has permissions for
        if self.privileged_user():
            return Question.objects.all()
        else:
            return Question.objects.filter(restricted=False)

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            raise PermissionDenied  # Need to raise forbidden if not staff member
        serializer.save()

class TopicRetrieveView(RetrieveAPIView):
    lookup_url_kwarg = 'topic_name'

    serializer_class = TopicSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        '''Fetch a specfic topic by name'''
        try:
            topic = Topic.objects.get(pk=self.kwargs[self.lookup_url_kwarg])
        except:
            raise Http404
        return topic


class SubtopicRetrieveView(RetrieveAPIView):
    serializer_class = SubtopicSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        topic = self.kwargs.get('topic_name', None)
        subtopic = self.kwargs.get('subtopic_name', None)
        '''Fetch a specfic subtopic by name'''
        try:
            subtopic = Subtopic.objects.get(topic=topic,name=subtopic)
        except:
            raise Http404
        return subtopic


class QuestionRetrieveView(QuestionApiMixin, RetrieveAPIView):
    lookup_url_kwarg = 'question_number'

    def get_object(self):
        '''If the user doesnt have permission to access the provided question, they are given 403 response'''
        try:
            question = Question.objects.get(pk=self.kwargs[self.lookup_url_kwarg])
        except:
            raise Http404

        if question.restricted and not self.privileged_user():
            raise PermissionDenied
        return question


class QuestionsListByTopic(QuestionApiMixin, ListAPIView):
    lookup_field = 'topic'
    lookup_url_kwarg = 'topic'

    def get_queryset(self):
        try:
            subtopics = Subtopic.objects.filter(topic=self.kwargs[self.lookup_url_kwarg])
        except:
            raise Http404
        questions_r = Question.objects.filter(subtopic__in=subtopics)
        if not questions_r.exists():
            raise Http404  # Topic is empty (contains no questions)

        if self.privileged_user():
            return questions_r  # Give privileged user all questions

        questions = Question.objects.filter(subtopic__in=subtopics, restricted=False)
        if not questions.exists():
            # Catch case where subtopic exists,
            # but all questions in it are restricted
            raise PermissionDenied
        return questions


class QuestionsListBySubtopic(QuestionApiMixin, ListAPIView):
    def get_queryset(self):
        topic = self.kwargs.get('topic', None)
        subtopic = self.kwargs.get('subtopic', None)
        if topic is not None and subtopic is not None:
            try:
                subtopic_pk = Subtopic.objects.get(topic=topic, name=subtopic)
            except:
                raise Http404
            questions_r = Question.objects.filter(subtopic=subtopic_pk)
            if not questions_r.exists():
                # User picked an empty topic
                raise Http404
            if self.privileged_user():
                return questions_r
            questions = Question.objects.filter(subtopic=subtopic_pk, restricted=False)

            if not questions.exists():
                # Catch case where subtopic exists,
                # but all questions in it are restricted
                raise PermissionDenied
            return questions


class QuestionsBySearch(QuestionApiMixin,ListAPIView):

    def get_queryset(self):
        search_terms = self.kwargs.get('search_terms',None)
        if search_terms is None:
            raise ValidationError("Must provide a search term")

        if self.privileged_user():
            questions = Question.objects.all()
        else:
            questions = Question.objects.filter(restricted=False)
        relevant_questions = watson.filter(questions,search_terms)
        if relevant_questions.exists():
            return relevant_questions
        else:
            raise Http404

