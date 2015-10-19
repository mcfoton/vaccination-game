# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vac', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='result',
            name='difficulty',
            field=models.PositiveSmallIntegerField(verbose_name='difficulty', max_length=1, default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='result',
            name='game_type',
            field=models.CharField(verbose_name='type', choices=[('urti', 'urti'), ('influenza', 'influenza'), ('vip', 'vip'), ('named', 'named')], default='urti', max_length=15),
            preserve_default=False,
        ),
    ]
