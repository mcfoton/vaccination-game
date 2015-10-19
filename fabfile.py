# -*- coding: utf-8 -*-
from fabric.api import cd, lcd, local, run, sudo, env
from fabriclassed import initialize
from fabriclassed.base import BaseFabric, DjangoFabric, VirtualenvFabric


class Fabric(BaseFabric, DjangoFabric, VirtualenvFabric):
    hosts = ['46.4.230.162']
    user = 'ram'

    test_default_app = 'vaccination'
    test_settings = 'settings_test'
    shell_plus = True

    remote_user = 'www-data'
    remote_project_path = '/var/www/vaccination'
    local_project_path = '/Users/ramusus/workspace/vaccination'
    applications_dir = 'project/apps'

    def fab_deploy(self, migrate=False, update=False):
        '''
        Deploy project to the remote host
            `migrate` boolean argument if neccesary to run syncdb and migrate (south) management commands
            `upgrade` list of applications separated by commas need to upgrade using pip
        '''
        local('git push')
        with cd(self.remote_project_path):
            run('git pull')
            if update:
                self.run_pip('install -r requirements.txt')
            if migrate:
                self.run_manage('syncdb')
                self.run_manage('migrate')

            sudo('supervisorctl restart vaccination')
            sudo('chown -R www-data:www-data logs')
            sudo('chmod -R 775 logs')
            self.run_manage('collectstatic --noinput')

__all__ = initialize(Fabric(), __name__)
