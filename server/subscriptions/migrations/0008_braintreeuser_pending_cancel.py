# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0007_auto_20160619_1541'),
    ]

    operations = [
        migrations.AddField(
            model_name='braintreeuser',
            name='pending_cancel',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
