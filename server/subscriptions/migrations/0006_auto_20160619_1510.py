# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0005_auto_20160619_1507'),
    ]

    operations = [
        migrations.AlterField(
            model_name='braintreeuser',
            name='subscription_id',
            field=models.CharField(default=b'', max_length=7),
            preserve_default=True,
        ),
    ]
