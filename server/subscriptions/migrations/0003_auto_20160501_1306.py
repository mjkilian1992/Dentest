# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0002_auto_20160410_1531'),
    ]

    operations = [
        migrations.AddField(
            model_name='braintreeuser',
            name='payment_method_token',
            field=models.CharField(max_length=36, null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='braintreeuser',
            name='subscription_id',
            field=models.CharField(max_length=7, null=True),
            preserve_default=True,
        ),
    ]
