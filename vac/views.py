import json
from django.views.generic import View
from django.http import HttpResponse
from django.views.generic.base import TemplateResponseMixin
from django.shortcuts import redirect
from django.http import HttpResponseForbidden
from django.utils.html import escape

from .models import Result
from .game import *
from .api import FabricAPI


class IndexView(View, TemplateResponseMixin):

    template_name = 'vac/index.html'

    def get(self, request):
        return self.render_to_response({
            'types': GAME_TYPES,
        })


class GameView(View, TemplateResponseMixin):

    template_name = 'vac/game.html'

    def get(self, request):
        if request.user.is_authenticated():
            return redirect('/#mode')
        else:
            return redirect('/')

    def post(self, request):
        game_type = request.POST.get('game-type', GAME_TYPES[0]['id'])
        for t in GAME_TYPES:
            if game_type == t['id']:
                name = t['name']
                break
        else:
            game_type = GAME_TYPES[0]['id']
            name = GAME_TYPES[0]['name']

        game_difficulty = int(request.POST.get('game-difficulty', 1))
        if game_difficulty not in range(3):
            game_difficulty = 1

        if game_type == 'named':
            name = escape(request.POST.get('name', name).strip())

        dummy_data = UNKNOWN_NAMES
        data = []
        if request.user.is_authenticated():
            provider = request.user.social_auth.get().provider
            token = request.user.social_auth.get().extra_data['access_token']
            user_id = request.user.social_auth.get().uid
            api = FabricAPI(provider)
            data = api.get_friends(token=token, user_id=user_id)
            use_dummy_data = False
        else:
            use_dummy_data = True

        params = {
            'use_dummy_data': use_dummy_data,
            'dummy_data': dummy_data,
            'data': data,
            'game_name': name,
            'game_difficulty': game_difficulty,
            'game_type': game_type,
        }

        return self.render_to_response({
            'params_json': json.dumps(params),
            'params': params,
        })


class ResultsView(View):
    def post(self, request):
        if 'score' not in request.POST:
            return HttpResponseForbidden()

        res = Result(user=request.user, score=request.POST['score'],
                       game_type=request.POST['game_type'], game_difficulty=request.POST['game_difficulty'])
        res.save()

        results = Result.objects.filter(game_type=res.game_type,
                                          game_difficulty=res.game_difficulty).select_related().order_by('-score', 'pk')
        results = list(results)
        to_send = {
            'user_place': 0,
            'near_users': [],
        }
        for index, value in enumerate(results):
            if value.pk == res.pk:
                to_send['user_place'] = index + 1
                for i in range(-4, 5):
                    if index + i < 0:
                        continue
                    try:
                        v = results[index + i]
                        to_send['near_users'].append({
                            'name': '%s %s' % (v.user.first_name, v.user.last_name),
                            'score': v.score,
                            'place': index + i + 1
                        })
                    except IndexError:
                        continue
                break

        to_send = json.dumps(to_send)

        return HttpResponse(to_send, content_type='text/json')
