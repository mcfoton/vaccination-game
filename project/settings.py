from os.path import join, dirname, abspath

DEBUG = False
TEMPLATE_DEBUG = False

ADMINS = (
    ('Kirill', 'bolonkin.kirill@gmail.com'),
    ('ramusus', 'ramusus@gmail.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'vac.newadmin.mtw.ru', 'vaccination.chickenkiller.com']

TIME_ZONE = 'Europe/Moscow'
SITE_ID = 1
USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGE_CODE = 'ru-ru'
LANGUAGES = (
    ('ru', 'Russian'),
)

ROOT = dirname(dirname(__file__))

MEDIA_ROOT = join(ROOT, 'media')
MEDIA_URL = '/media/'

STATIC_ROOT = join(ROOT, 'static')
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    join(ROOT, 'vac', 'static'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

SECRET_KEY = '-9v6om2=goa6t0(*%%^uh&n4hjwhl$u#_o0h4e93tdd69#!rph'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.core.context_processors.request',
    'django.contrib.messages.context_processors.messages',
    'social.apps.django_app.context_processors.backends',
    'social.apps.django_app.context_processors.login_redirect',
)

TEMPLATE_DIRS = (
    join(ROOT, 'templates'),
)


MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'social.apps.django_app.middleware.SocialAuthExceptionMiddleware',
)

ROOT_URLCONF = 'project.urls'

WSGI_APPLICATION = 'project.wsgi.application'

TEST_RUNNER = 'django.test.runner.DiscoverRunner'

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'vac',

    'django_extensions',
    'social.apps.django_app.default',

)

LOGIN_REDIRECT_URL = '/#mode'
SOCIAL_AUTH_LOGIN_ERROR_URL = '/'

AUTHENTICATION_BACKENDS = (
    'vac.backends.VK',
    'social.backends.odnoklassniki.OdnoklassnikiOAuth2',
    'social.backends.facebook.FacebookOAuth2',
)

SOCIAL_AUTH_VK_KEY = '4932428'
SOCIAL_AUTH_VK_SECRET = 'sGTTK0gsdxA69IXPi2EY'
SOCIAL_AUTH_VK_SCOPE = ['notify', 'friends', 'photos']

SOCIAL_AUTH_ODNOKLASSNIKI_OAUTH2_KEY = ''
SOCIAL_AUTH_ODNOKLASSNIKI_OAUTH2_SECRET = ''
SOCIAL_AUTH_ODNOKLASSNIKI_OAUTH2_PUBLIC_NAME = ''

SOCIAL_AUTH_FACEBOOK_KEY = '686389721439108'
SOCIAL_AUTH_FACEBOOK_SECRET = '99bee24e990f6acadc5ab7644f37ceae'
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {'locale': 'ru_RU'}

try:
    from .settings_local import *
except ImportError:
    pass
