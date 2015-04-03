# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0002_question_restricted'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='question',
            options={'ordering': ['subtopic', 'pk'], 'verbose_name_plural': 'Questions'},
        ),
        migrations.AlterModelOptions(
            name='subtopic',
            options={'ordering': ['topic', 'name'], 'verbose_name_plural': 'Subtopics'},
        ),
        migrations.AlterModelOptions(
            name='topic',
            options={'ordering': ['name'], 'verbose_name_plural': 'Topics'},
        ),
    ]
