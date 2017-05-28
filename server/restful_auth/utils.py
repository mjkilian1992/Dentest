from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template import loader

from dentest.settings_utility import get_setting

def send_email(to_email, from_email, context, subject_template_name,
               plain_body_template_name, html_body_template_name=None):
    """Used to send an email to the user"""
    subject = loader.render_to_string(subject_template_name, context)
    subject = ''.join(subject.splitlines())
    body = loader.render_to_string(plain_body_template_name, context)
    email_message = EmailMultiAlternatives(subject, body, from_email, [to_email])
    if html_body_template_name is not None:
        html_email = loader.render_to_string(html_body_template_name, context)
        email_message.attach_alternative(html_email, 'text/html')
    email_message.send()


def get_email_context(self, user):
    """Pulls site settings together to splice into emails"""
    token = self.token_generator.make_token(user)
    uid = user.pk
    return {
        'user': user,
        'domain': get_setting('DOMAIN'),
        'site_name': get_setting('SITE_NAME'),
        'uid': uid,
        'token': token,
        'protocol': 'https' if self.request.is_secure() else 'http',
    }