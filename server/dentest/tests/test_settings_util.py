import os
import dentest.settings_utility as settings_util
from django.test import TestCase

class SettingsUtilityTestCase(TestCase):

    def test_settings_retrieval(self):
        # Test retrieval from environment variable
        os.environ['DJANGO_SETTINGS_MODULE'] = 'dentest.tests.settings_1'
        reload(settings_util)

        self.assertEqual("Test", settings_util.get_setting("TEST_SETTING_1"))
        with self.assertRaises(AttributeError) as context:
            settings_util.get_setting("TEST_SETTING_2")

        # Try reloading with a new settings module
        os.environ['DJANGO_SETTINGS_MODULE'] = 'dentest.tests.settings_2'
        reload(settings_util)

        self.assertEqual("Test2", settings_util.get_setting("TEST_SETTING_1"))

        # Try when the file specified does not exist
        os.environ['DJANGO_SETTINGS_MODULE'] = "dentest.tests.does_not_exist"
        with self.assertRaises(ImportError):
            reload(settings_util)