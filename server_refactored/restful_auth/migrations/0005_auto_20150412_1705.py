# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restful_auth', '0004_passwordreset_used'),
    ]

    operations = [
        migrations.AlterField(
            model_name='passwordreset',
            name='used',
            field=models.BooleanField(default=False),
        ),
    ]
