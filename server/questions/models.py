from django.db import models

import watson.search

# Must be unicode! This is how they are stored in the database
class Topic(models.Model):
    """Defines a top-level topic which acts as a root for a set of subtopics"""
    name = models.CharField(max_length=80, primary_key=True)
    description = models.TextField(default='')

    def __str__(self):
        return 'Topic: ' + str(self.name)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Topics'


class Subtopic(models.Model):
    """A more specfic topic which contains questions"""
    topic = models.ForeignKey(Topic)
    name = models.CharField(max_length=255)
    description = models.TextField(default='')

    def __str__(self):
        return 'Subtopic: ' + str(self.topic).split(':')[1] + '->' + str(self.name)

    class Meta:
        ordering = ['topic','name']
        verbose_name_plural = 'Subtopics'


class Question(models.Model):
    """A question and corresponding answer"""
    subtopic = models.ForeignKey(Subtopic)
    question = models.TextField()
    answer = models.TextField()
    restricted = models.BooleanField(default=False)

    def __str__(self):
        return str({
            'Topic->Subtopic':str(self.subtopic),
            'Question':str(self.question),
            'Answer':str(self.answer),
            'Restricted':str(self.restricted),
        })

    class Meta:
        ordering = ['subtopic','id']
        verbose_name_plural = 'Questions'



# Register Watson Models

watson.search.register(Question)