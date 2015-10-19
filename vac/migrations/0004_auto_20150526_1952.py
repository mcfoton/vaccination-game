# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vac', '0003_auto_20150526_1948'),
    ]

    operations = [
        migrations.RenameField(
            model_name='result',
            old_name='difficulty',
            new_name='game_difficulty',
        ),
    ]
