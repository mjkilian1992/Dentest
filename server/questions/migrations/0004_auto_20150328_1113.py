# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0003_auto_20150319_0059'),
    ]

    operations = [
        migrations.AddField(
            model_name='subtopic',
            name='description',
            field=models.TextField(default=b''),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='topic',
            name='description',
            field=models.TextField(default=b''),
            preserve_default=True,
        ),
    ]
