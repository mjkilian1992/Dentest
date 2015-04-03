from rest_framework import serializers
from models import *


class TopicSerializer(serializers.ModelSerializer):
    """REST API Serializer for Topic Model"""
    class Meta:
        model = Topic
        fields = (
            'name',
            'description',
        )


class SubtopicSerializer(serializers.ModelSerializer):
    """REST API Serializer for Subtopic Model"""
    class Meta:
        model = Subtopic
        fields = (
            'id',
            'topic',
            'name',
            'description',
        )


class QuestionSerializer(serializers.ModelSerializer):
    """REST API Serializer for Question Model"""
    class Meta:
        model = Question
        fields = (
            'id',
            'subtopic',
            'question',
            'answer',
            'restricted',
        )