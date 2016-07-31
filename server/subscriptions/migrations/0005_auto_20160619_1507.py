# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0004_auto_20160619_1446'),
    ]

    operations = [
        migrations.AlterField(
            model_name='braintreeuser',
            name='expiry_date',
            field=models.DateTimeField(default=None, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='braintreeuser',
            name='subscription_id',
            field=models.CharField(max_length=7, null=True, blank=True),
            preserve_default=True,
        ),
    ]
