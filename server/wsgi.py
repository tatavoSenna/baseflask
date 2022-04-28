from app import create_app
import inspect
from app import db, models

app = create_app()

# Auto-import all models on shell
@app.shell_context_processor
def make_shell_context():
    return dict(db=db, **dict(inspect.getmembers(models, inspect.isclass)))
