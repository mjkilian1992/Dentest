# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restful_auth', '0003_passwordreset'),
    ]

    operations = [
        migrations.AddField(
            model_name='passwordreset',
            name='used',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
