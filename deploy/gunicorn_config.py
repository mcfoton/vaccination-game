import multiprocessing
from os.path import join, dirname, abspath

ROOT = dirname(dirname(abspath(__file__)))
LOGS_FOLDER = join(ROOT, 'logs')

bind = 'unix:' + join(ROOT, 'run', 'gunicorn.sock')

workers = multiprocessing.cpu_count() * 2 + 1
threads = multiprocessing.cpu_count() * 3

keepalive = 5

user = 'cambay'
group = 'cambay'

proc_name = 'vac-cambay'

accesslog = join(LOGS_FOLDER, 'gunicorn_access_log')
access_log_format = '%({x-real-ip}i)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'
errorlog = join(LOGS_FOLDER, 'gunicorn_error_log')