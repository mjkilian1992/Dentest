from django.conf.urls import patterns, url
from questions import generic_views as views

urlpatterns = patterns('',

    # ========================QUESTION VIEWS==========================================================================#
    # Fetch question by ID
    url(r'^questions/question_number/(?P<question_number>[0-9]{1,100})/$',
        views.QuestionRetrieveView.as_view()),

    # Fetch questions by topic/subtopic
    url(r'questions/by_topic/(?P<topic>[\w ]{1,80})/$',views.QuestionsListByTopic.as_view()),
    url(r'questions/by_subtopic/(?P<topic>[\w ]{1,80})/(?P<subtopic>[\w ]{1,255})/$',
        views.QuestionsListBySubtopic.as_view()),

    # Fetch ALL questions
    url(r'^questions/$',views.QuestionListCreateView.as_view()),

    # Text search for questions
    url(r'^questions_search/(?P<search_terms>.*)/$',views.QuestionsBySearch.as_view()),

    #======================================TOPIC VIEWS=================================================================#
    url(r'^topics/$',views.TopicView.as_view()),
    url(r'^topic/(?P<topic_name>[\w ]{1,80})/$',views.TopicRetrieveView.as_view()),

    #============================================SUBTOPIC VIEWS========================================================#
    url(r'subtopics/$',views.SubtopicView.as_view()),
    url(r'^subtopic/(?P<topic_name>[\w ]{1,80})/(?P<subtopic_name>[\w ]{1,255})/$',views.SubtopicRetrieveView.as_view()),

)