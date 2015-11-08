from django.test import TestCase
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from questions.models import *


class BaseQuestionAPITestCase(TestCase):
    def setUp(self):
        # Create groups with name matching Privileged Groups
        self.free = Group(name='Free')
        self.free.save()
        self.premium = Group(name='Premium')
        self.premium.save()

        # Create one free, one premium and one staff user
        self.free_user = User.objects.create_user('test_token_free',
                                                    'free@fake.com',
                                                    'password1',
                                                    )
        self.free_user.groups.add(self.free)
        self.free_user.save()
        self.free_token, _ = Token.objects.get_or_create(user=self.free_user)

        self.premium_user = User.objects.create_user('test_token_premium',
                                                    'premium@fake.com',
                                                    'password2',
                                                    )
        self.premium_user.groups.add(self.premium)
        self.premium_user.save()
        self.premium_token, _ = Token.objects.get_or_create(user=self.premium_user)

        self.staff_user = User.objects.create_user('test_token_staff',
                                                   'staff@fake.com',
                                                   'password3',
                                                   )
        self.staff_user.is_staff = True
        self.staff_user.save()
        self.staff_token, _ = Token.objects.get_or_create(user=self.staff_user)

        # Create APIFactory and Client
        self.client = APIClient()

        # Populate database
        # Mixed
        t1 = Topic.objects.create(name='Topic 1', description='The first topic.')
        #Only restricted questions
        t2 = Topic.objects.create(name='Topic 2', description='The second topic.')
        #Empty
        t3 = Topic.objects.create(name='Topic 3', description='The third topic.')

        # Mixed
        s1 = Subtopic.objects.create(name='Subtopic 1',
                                     topic=t1,
                                     description='The first subtopic of topic 1.')
        # All restricted
        s2 = Subtopic.objects.create(name='Subtopic 2',
                                     topic=t1,
                                     description='The second subtopic of topic 1.')
        s3 = Subtopic.objects.create(name='Subtopic 3',
                                     topic=t2,
                                     description='The first subtopic of topic 2.')
        # Empty
        s4 = Subtopic.objects.create(name='Subtopic 4',
                                     topic=t2,
                                     description='The second subtopic of topic 2.')

        q1 = Question.objects.create(id=1,
                                     question='What is my name?',
                                     answer='Test',
                                     subtopic=s1,
                                     restricted=False)
        q2 = Question.objects.create(id=2,
                                     question='What app is this?',
                                     answer='Dentest_token',
                                     subtopic=s1,
                                     restricted=True)
        q3 = Question.objects.create(id=3,
                                     question='Have I run out of questions?',
                                     answer='Nope',
                                     subtopic=s2,
                                     restricted=True)
        q4 = Question.objects.create(id=4,
                                     question='What about now?',
                                     answer="Yeah, I've ran out...",
                                     subtopic=s3,
                                     restricted=True)

    def tearDown(self):
        # Destroy all database entities
        User.objects.all().delete()
        Group.objects.all().delete()
        Question.objects.all().delete()
        Subtopic.objects.all().delete()
        Topic.objects.all().delete()
        self.client = None