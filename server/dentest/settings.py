"""
Django settings for dentest project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Import Module Settings and Init Scripts
from subscriptions import braintree_init


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'q&(ymk$u0)=g9e3wukv6@qkly$&c-$=07ds#&jnt=0wicm@o^i'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = ['localhost','127.0.0.1']

SITE_ID = 1

# Application definition
INSTALLED_APPS = (
    'django.contrib.admin.apps.SimpleAdminConfig',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    #CORS - DELETE ON DEPLOYMENT
    'corsheaders',

    #Third Party Apps#
    'tinymce',
    'adminplus',
    'crispy_forms',
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',
    'watson',
    'django_countries',

    #My Apps
    'questions',
    'restful_auth',
    'subscriptions',
)

#CORS CONFIG - REMOVE ON DEPLOYMENT
CORS_ORIGIN_ALLOW_ALL = True

MIDDLEWARE_CLASSES = (
    'corsheaders.middleware.CorsMiddleware', #REMOVE ON DEPLOYMENT
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    #'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'dentest.urls'

WSGI_APPLICATION = 'dentest.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}



# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT=os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', 'static'))


STATICFILES_FINDERS = (
'django.contrib.staticfiles.finders.FileSystemFinder',
'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# Email Config
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES':(
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
}

#===================================RESTFUL AUTH CONFIG===============================================================#

# Site info
USE_TZ = True # Allow timezones

DOMAIN = 'localhost:9001'
SITE_NAME = 'Dentest'
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'restful_auth.backends.UsernameOrEmailBackend',
)
EMAIL_UNIQUE =True # Asserts that an email can only be used once for reg


# email confirmations & password resets
EMAIL_CONFIRMATION_DAYS_VALID = 3
ACTIVATION_URL = 'email_activation/{username}/{token}'
PASSWORD_RESET_DAYS_VALID = 3
PASSWORD_RESET_CONFIRM_URL = 'password_reset_confirm/{username}/{token}'
DEFAULT_PROTOCOL = 'http'
FROM_EMAIL = 'dentest.reg@gmail.com'

TEMPLATE_DIRS = (
    '/restful_auth/templates/',
)

# Password Requirements
PASSWORD_MIN_LENGTH = 8
PASSWORD_COMPLEXITY = { # You can omit any or all of these for no limit for that particular set
    "UPPER": 1,        # Uppercase
    "LOWER": 1,        # Lowercase
    "LETTERS": 1,       # Either uppercase or lowercase letters
    "DIGITS": 1,       # Digits
    "PUNCTUATION": 1,  # Punctuation (string.punctuation)
    #"SPECIAL": 1,      # Not alphanumeric, space or punctuation character
    #"WORDS": 1         # Words (alphanumeric sequences separated by a whitespace or punctuation character)
}

# LOGGING CONFIG
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'file':{
            'filename' : "./logs/dentest.log",
            'level': 'INFO',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'when': 'd',
            'interval': 1,
            'backupCount': 7,
            'formatter' : 'verbose'
        },

        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'formatter' : 'verbose'
        }
    },
    'root':{
        'handlers': ['file'],
        'propagate': True,
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'propagate': True,
            'level': 'INFO',
        },
        'django.request': {
            'handlers': ['mail_admins','file'],
            'level': 'INFO',
            'propagate': False,
        },
    }
}

