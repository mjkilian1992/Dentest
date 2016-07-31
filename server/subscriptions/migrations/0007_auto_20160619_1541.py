# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0006_auto_20160619_1510'),
    ]

    operations = [
        migrations.AlterField(
            model_name='braintreeuser',
            name='subscription_id',
            field=models.CharField(default=b'', max_length=7, blank=True),
            preserve_default=True,
        ),
    ]
