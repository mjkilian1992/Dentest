from django.conf.urls import patterns, include, url
from django.contrib import admin
from questions import generic_views as q_views
from questions import views as single_q_views

urlpatterns = patterns('',

    url(r'^admin/', include(admin.site.urls)),

    #REST ENDPOINTS
    url(r'^questions/question_number/(?P<question_number>[0-9]{1,100})/$',
        q_views.QuestionRetrieveView.as_view()),
    url(r'questions/by_topic/(?P<topic>[\w ]{1,80})/$',q_views.QuestionsListByTopic.as_view()),
    url(r'questions/by_subtopic/(?P<topic>[\w ]{1,80})/(?P<subtopic>[\w ]{1,255})/$',q_views.QuestionsListBySubtopic.as_view()),
    url(r'^questions/$',q_views.QuestionListCreateView.as_view()),
    url(r'^questions_search/(?P<search_terms>.*)/$',q_views.QuestionsBySearch.as_view()),
    url(r'^topics/$',q_views.TopicView.as_view()),
    url(r'^topic/(?P<topic_name>[\w ]{1,80})/$',q_views.TopicRetrieveView.as_view()),
    url(r'subtopics/$',q_views.SubtopicView.as_view()),
    url(r'^subtopic/(?P<topic_name>[\w ]{1,80})/(?P<subtopic_name>[\w ]{1,255})/$',q_views.SubtopicRetrieveView.as_view()),
    url(r'^quiz/$',single_q_views.QuizView.as_view()),
    # REST Framework Authentication (only need to be able to log in to REST view
    url(r'^api-auth/',include('rest_framework.urls',namespace='rest_framework')),
    # REST AUTH ENDPOINTS
    url(r'',include('restful_auth.urls',namespace='restful_auth')),
)
