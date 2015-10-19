import requests
import json


def FabricAPI(provider):
    for key, value in globals().items():
        if key != 'FabricAPI' and key.endswith('API') and key[:-3].lower() == provider:
            return value()

    raise NameError('The provider API %s is not found.' % provider)

class VkAPI:
    def make_request(self, method, **kwargs):
        params = kwargs
        params['v'] = '5.33'
        params['lang'] = 'ru'
        url = 'https://api.vk.com/method/' + method
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.content
        raise ConnectionError('Something went wrong. Please, try again later.')

    def get_friends(self, **kwargs):
        content = self.make_request('friends.get', count=200, fields='name, photo_100, photo_200_orig, sex', order='random', **kwargs)
        content = json.loads(content.decode('UTF-8'))

        clean_content = []
        for u in content['response']['items']:
            clean_u = {
                'first_name': u['first_name'],
                'last_name': u['last_name'],
                'sex': u['sex'],
                'photo': u['photo_100'],
                'big_photo': u['photo_200_orig'],
            }
            clean_content.append(clean_u)
        return clean_content


class FacebookAPI:
    def make_request(self, method, **kwargs):
        pass

    def get_friends(self):
        pass
