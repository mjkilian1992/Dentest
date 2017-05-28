import os
from importlib import import_module

SETTINGS = import_module(os.environ['DJANGO_SETTINGS_MODULE'])


def get_setting(setting_name):
    value = getattr(SETTINGS, setting_name)
    return value


def get_setting_with_default(setting_name, default_value):
    try:
        return getattr(SETTINGS, setting_name)
    except AttributeError:
        return default_value