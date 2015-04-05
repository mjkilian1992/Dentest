from django.conf.urls import patterns, include, url
from django.contrib import admin
from questions import views as q_views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'dentest.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),

    #django auth urls (required by django rest auth
    url(r'^', include('django.contrib.auth.urls')),

    #REST ENDPOINTS
    url(r'^questions/',q_views.QuestionView.as_view()),
    url(r'^topics/$',q_views.TopicView.as_view()),
    url(r'subtopics/$',q_views.SubtopicView.as_view()),
    url(r'^api-auth/',include('rest_framework.urls',namespace='rest_framework')),

    # Djoser Endpoints
    url(r'^auth/', include('djoser.urls')),
)
