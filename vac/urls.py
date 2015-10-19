from django.conf.urls import patterns, include, url
from django.contrib import admin
from vac.views import *

urlpatterns = patterns('',
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^game$', GameView.as_view(), name='game'),
    url(r'^results', ResultsView.as_view(), name='results'),
)