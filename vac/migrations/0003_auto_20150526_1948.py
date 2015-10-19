# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vac', '0002_auto_20150526_1948'),
    ]

    operations = [
        migrations.AlterField(
            model_name='result',
            name='difficulty',
            field=models.PositiveSmallIntegerField(verbose_name='difficulty'),
        ),
    ]
