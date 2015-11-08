from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from serializers import *


class TopicView(APIView):
    '''
    Access Topics. Only staff can edit these.
    '''
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Topic.objects.all()

    def get(self, request, format=None):
        topics = self.get_queryset()
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = TopicSerializer(data=request.data)
        if serializer.is_valid():
            if not request.user.is_staff:
                return Response(serializer.data, status=status.HTTP_403_FORBIDDEN)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)


class SubtopicView(APIView):
    '''
    Access Subtopics
    '''
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Subtopic.objects.all()

    def get(self, request, format=None):
        subtopics = self.get_queryset()
        serializer = SubtopicSerializer(subtopics, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SubtopicSerializer(data=request.data)
        if serializer.is_valid():
            if not request.user.is_staff:
                return Response(serializer.data, status=status.HTTP_403_FORBIDDEN)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
