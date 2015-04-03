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
            'topic',
            'name',
            'description',
        )

class RelationalSubtopicSerializer(serializers.ModelSerializer):
    """Allows questions to reference their topic and subtopic"""
    class Meta:
        model = Subtopic
        fields = (
            'topic',
            'name'
        )

class QuestionSerializer(serializers.ModelSerializer):
    """REST API Serializer for Question Model"""
    subtopic = RelationalSubtopicSerializer()
    class Meta:
        model = Question
        fields = (
            'id',
            'subtopic',
            'question',
            'answer',
            'restricted',
        )