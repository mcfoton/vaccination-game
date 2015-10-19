from django.db import models
from django.contrib.auth.models import User
from .game import GAME_TYPES

TYPES = [(t['id'], t['id']) for t in GAME_TYPES]


class Result(models.Model):
    user = models.ForeignKey(User)
    score = models.PositiveIntegerField('score')
    game_type = models.CharField('type', max_length=15, choices=TYPES)
    game_difficulty = models.PositiveSmallIntegerField('difficulty')
