from os import path, environ
from git import Repo
from git.refs import remote
import gitlab

curr_dir = path.dirname(path.dirname(__file__))
repo = Repo(curr_dir)
repo.config_writer().set_value("user", "name", "lawing ci").release()
repo.config_writer().set_value("user", "email", "dev@lawing.com.br").release()


if environ.get('CI', None):
    gl = gitlab.Gitlab('https://gitlab.com/', private_token = environ['CI_GITLAB_TOKEN'])
    lawing_project = gl.projects.get(environ['CI_PROJECT_ID'])
    repo.remotes.origin.set_url(f'https://oauth2:{environ["CI_GITLAB_TOKEN"]}@gitlab.com/lawing2/lawing_server.git')
else:
    gl = gitlab.Gitlab.from_config('lawing')
    lawing_project = gl.projects.get(17627914)

def fetch_branches():
    for remote in repo.remotes:
        remote.fetch()

def staging_checkout():
    print('preparing Stage branch')
    try:
        repo.git.checkout('Stage')
    except:
        repo.git.checkout('-b','Stage')
    
    repo.git.reset('--hard', 'origin/dev')


def merge_into_staging():
    
    fetch_branches()

    staging_checkout()

    mrs = lawing_project.mergerequests.list(state='opened')
    for mr in mrs:
        if 'demo' in mr.labels:
            print(f'Mergando {mr.title}')
            source_branch = mr.source_branch
            repo.git.merge(f'origin/{source_branch}')
    repo.git.push('--set-upstream', 'origin', repo.active_branch, force=True)


merge_into_staging()

