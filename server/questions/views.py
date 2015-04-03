from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from serializers import *

class TopicView(APIView):
    '''
    Access Topics. Only staff can edit these.
    '''

    def get_queryset(self):
        return Topic.objects.all()

    def get(self,request,format=None):
        topics = self.get_queryset()
        serializer = TopicSerializer(topics,many=True)
        return Response(serializer.data)

    def post(self,request,format=None):
        serializer = TopicSerializer(data=request.data)
        if serializer.is_valid():
            if not request.user.is_staff:
                return Response(serializer.data,status=status.HTTP_403_FORBIDDEN)
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.data,status=status.HTTP_400_BAD_REQUEST)

class SubtopicView(APIView):
    '''
    Access Subtopics
    '''

    def get_queryset(self):
        return Subtopic.objects.all()

    def get(self,request,format=None):
        subtopics = self.get_queryset()
        serializer = SubtopicSerializer(subtopics,many=True)
        return Response(serializer.data)

    def post(self,request,format=None):
        serializer = SubtopicSerializer(data=request.data)
        if serializer.is_valid():
            if not request.user.is_staff:
                return Response(serializer.data,status=status.HTTP_403_FORBIDDEN)
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.data,status=status.HTTP_400_BAD_REQUEST)

class QuestionView(APIView):
    '''
    Access Questions.
    '''

    def privileged_user(self):
        '''
        Check a user can access restricted questions. True if the user
        is either a staff member or in group Silver or above
        '''
        if self.request.user.groups.filter(name__in=PRIVILEGED_GROUPS) \
            or self.request.user.is_staff:
            return True
        return False

    def get_queryset(self):
        '''
        Show restricted questions only to Silver+ users. Questions can be
        accessed individually by question number or filtered by subtopic
        :return:
        '''
        #Look for query parameters which dictate filtering
        subtopic_pk = self.request.query_params.get('subtopic',None)
        pk = self.request.query_params.get('question',None)

        # No filtering. Just display all questions user has permissions for
        if not self.request.query_params:
            if self.privileged_user():
                return Question.objects.all()
            else:
                return Question.objects.filter(restricted=False)
        # filtering by subtopic
        elif subtopic_pk is not None:
            questions_r = Question.objects.filter(subtopic=subtopic_pk)
            if self.privileged_user():
                return questions_r
            questions = Question.objects.filter(subtopic=subtopic_pk,restricted=False)
            if not questions.exists() and not questions_r.exists():
                # Catch case where no such subtopic exists
                raise Http404
            elif not questions.exists():
                # Catch case where subtopic exists,
                # but all questions in it are restricted
                raise PermissionDenied
            return questions
        elif pk is not None:
            try:
                q = Question.objects.get(pk=pk)
            except:
                raise Http404
            if not self.privileged_user() and q.restricted:
                raise PermissionDenied
            else:
                # return the single question as a list for compatibility
                return (q,)

    def get(self,request,format=None):
        '''
        Get questions. Can return all questions, all questions in a subtopic or a specific
        question by id. Results are filtered based on the user's group
        :param request:
        :param subtopic_pk:
        :param pk:
        :param format:
        :return:
        '''
        questions = self.get_queryset()
        serializer = QuestionSerializer(questions,many=True)
        return Response(serializer.data)

    def post(self,request,format=None):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            if not request.user.is_staff:
                return Response(serializer.data,status=status.HTTP_403_FORBIDDEN)
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.data,status=status.HTTP_400_BAD_REQUEST)