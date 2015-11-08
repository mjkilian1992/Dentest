"""
URLs here define endpoints for REST Authentication API
"""
from django.conf.urls import patterns, include, url
from restful_auth import views

urlpatterns = patterns('',
    url(r'^api-auth/',include('rest_framework.urls',namespace='rest_framework')),
    url(r'^login/$',views.LoginView.as_view()),
    url(r'^register/$',views.RegistrationView.as_view()),
    url(r'^confirm_email/$',views.ConfirmEmailView.as_view()),
    url(r'^password_reset/$',views.PasswordResetView.as_view()),
    url(r'^password_reset_confirm/$',views.PasswordResetConfirmView.as_view()),
    url(r'^update_profile/$',views.UserUpdateView.as_view()),
)