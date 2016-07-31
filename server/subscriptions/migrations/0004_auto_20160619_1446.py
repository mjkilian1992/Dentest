# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0003_auto_20160501_1306'),
    ]

    operations = [
        migrations.AddField(
            model_name='braintreeuser',
            name='active',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='braintreeuser',
            name='expiry_date',
            field=models.DateTimeField(default=None, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='braintreeuser',
            name='subscription_id',
            field=models.CharField(default=None, max_length=7, null=True),
            preserve_default=True,
        ),
    ]
