DEBUG = True
TEMPLATE_DEBUG = True
THUMBNAIL_DEBUG = True
SEND_BROKEN_LINK_EMAILS = False
ACCOUNT_DOMAIN = 'localhost:8000'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'vaccination',
        'USER': 'vaccination',
        'PASSWORD': 'vaccination',
        'HOST': '',
        'PORT': '',
    }
}

SOCIAL_AUTH_VK_KEY = '5089009'
SOCIAL_AUTH_VK_SECRET = 'kpA87c2lJffZtrvu1dKo'
SOCIAL_AUTH_VK_SCOPE = ['notify', 'friends', 'photos']
