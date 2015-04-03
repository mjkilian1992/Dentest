# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0004_auto_20150328_1113'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='question',
            options={'ordering': ['subtopic', 'id'], 'verbose_name_plural': 'Questions'},
        ),
    ]
