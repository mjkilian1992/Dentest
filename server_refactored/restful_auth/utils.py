from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template import loader


def send_email(to_email, from_email, context, subject_template_name,
               plain_body_template_name, html_body_template_name=None):
    subject = loader.render_to_string(subject_template_name, context)
    subject = ''.join(subject.splitlines())
    body = loader.render_to_string(plain_body_template_name, context)
    email_message = EmailMultiAlternatives(subject, body, from_email, [to_email])
    if html_body_template_name is not None:
        html_email = loader.render_to_string(html_body_template_name, context)
        email_message.attach_alternative(html_email, 'text/html')
    email_message.send()


def get_email_context(self, user):
    token = self.token_generator.make_token(user)
    uid = user.pk
    return {
        'user': user,
        'domain': getattr(settings,'DOMAIN'),
        'site_name': getattr(settings,'SITE_NAME'),
        'uid': uid,
        'token': token,
        'protocol': 'https' if self.request.is_secure() else 'http',
    }