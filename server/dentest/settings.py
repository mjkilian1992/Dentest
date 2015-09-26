"""
Django settings for dentest project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

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

ALLOWED_HOSTS = []

SITE_ID = 1

# Application definition
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    #CORS - DELETE ON DEPLOYMENT
    'corsheaders',

    #Third Party Apps#
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',

    #My Apps
    'questions',
    'restful_auth',
)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES':(
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
}

# Restful Auth Config
USE_TZ = True # Allow timezones
EMAIL_CONFIRMATION_DAYS_VALID = 3
PASSWORD_RESET_DAYS_VALID = 3
EMAIL_UNIQUE =True
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'restful_auth.backends.UsernameOrEmailBackend',
)
DOMAIN = 'localhost:9001'
SITE_NAME = 'Dentest'
PASSWORD_RESET_CONFIRM_URL = 'password_reset_confirm/{username}/{token}'
ACTIVATION_URL = 'email_activation/{username}/{token}'
DEFAULT_PROTOCOL = 'http'
FROM_EMAIL = 'dentest.reg@gmail.com'

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

TEMPLATE_DIRS = (
    '/restful_auth/templates/',
)

#GROUPS CONFIG
BASIC_GROUP_NAME = u'Bronze'
PRIVILEGED_GROUPS = (u'Silver', u'Gold')

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

# Email Config
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
