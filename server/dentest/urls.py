from django.conf.urls import patterns, include, url
from django.contrib import admin
from restful_auth import views as auth_views
from questions import generic_views as q_views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'dentest.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),

    #REST ENDPOINTS
    url(r'^questions/question_number/(?P<question_number>[0-9]{1,100})/$',
        q_views.QuestionRetrieveView.as_view()),
    url(r'questions/by_topic/(?P<topic>[\w ]{1,80})/$',q_views.QuestionsListByTopic.as_view()),
    url(r'questions/by_subtopic/(?P<topic>[\w ]{1,80})/(?P<subtopic>[\w ]{1,255})/$',q_views.QuestionsListBySubtopic.as_view()),
    url(r'^questions/$',q_views.QuestionListCreateView.as_view()),
    url(r'^topics/$',q_views.TopicView.as_view()),
    url(r'^topic/(?P<topic_name>[\w ]{1,80})/$',q_views.TopicRetrieveView.as_view()),
    url(r'subtopics/$',q_views.SubtopicView.as_view()),
    url(r'^subtopic/(?P<topic_name>[\w ]{1,80})/(?P<subtopic_name>[\w ]{1,255})/$',q_views.SubtopicRetrieveView.as_view()),
    url(r'^api-auth/',include('rest_framework.urls',namespace='rest_framework')),

    # REST AUTH ENDPOINTS
    url(r'^login/$',auth_views.LoginView.as_view()),
    url(r'^register/$',auth_views.RegistrationView.as_view()),
    url(r'^confirm_email/$',auth_views.ConfirmEmailView.as_view()),
    url(r'^password_reset/$',auth_views.PasswordResetView.as_view()),
    url(r'^password_reset_confirm/$',auth_views.PasswordResetConfirmView.as_view()),
    url(r'^update_profile/$',auth_views.UserUpdateView.as_view()),
)
