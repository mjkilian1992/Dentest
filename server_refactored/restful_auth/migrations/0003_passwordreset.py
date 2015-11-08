# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('restful_auth', '0002_auto_20150411_1622'),
    ]

    operations = [
        migrations.CreateModel(
            name='PasswordReset',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('time_created', models.DateTimeField(default=django.utils.timezone.now)),
                ('time_sent', models.DateTimeField(null=True)),
                ('key', models.CharField(unique=True, max_length=64)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'PasswordResets',
            },
            bases=(models.Model,),
        ),
    ]
