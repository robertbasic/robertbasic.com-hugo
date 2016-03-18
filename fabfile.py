from fabric.api import *
from time import strftime, gmtime

env.forward_agent = True
env.roledefs = {
    'robertbasic.com': ['robert@robertbasic.com'],
}

WEBSITE_PATH = "/var/www/robertbasic.com-hugo"

def create_public():
    with cd(WEBSITE_PATH):
        run('[ -d public ] || mkdir public')

def build_hugo():
    local('hugo')

def tar_public():
    local('tar -czf public.tar.gz public')

def copy_public():
    local('scp public.tar.gz robert@robertbasic.com:' + WEBSITE_PATH)

def untar_public():
    with cd(WEBSITE_PATH):
        run('tar -xzf public.tar.gz')

def remove_tar():
    local('rm public.tar.gz')

    with cd(WEBSITE_PATH):
        run('rm public.tar.gz')

@task
def deploy():
    time = strftime("%Y-%m-%d-%H.%M.%S", gmtime())
    tag = "prod/%s" % time
    local('git checkout master')
    local('git tag -a %s -m "Prod"' % tag)
    local('git push --tags')

    env.roles = ['robertbasic.com']

    execute(build_hugo)
    execute(tar_public)
    execute(create_public)
    execute(copy_public)
    execute(untar_public)
    execute(remove_tar)

@task
def rollback(num_revs=1):
    with cd(WEBSITE_PATH):
        run('git fetch')
        tag = run('git tag -l prod/* | sort | tail -n' + \
            str(1 + int(num_revs)) + ' | head -n1')
        run('git checkout ' + tag)
