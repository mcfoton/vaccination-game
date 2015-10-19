from social.backends import vk


class VK(vk.VKOAuth2):
    # Just for pretty name
    name = 'vk'
