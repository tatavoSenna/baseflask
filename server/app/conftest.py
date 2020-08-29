import pytest

from app import create_app, db as app_db


@pytest.yield_fixture(scope='session')
def app():
    app = create_app()
    yield app

@pytest.yield_fixture(scope='session')
def db(app):
    app_db.app = app
    app_db.create_all()

    yield app_db

    app_db.drop_all()


@pytest.fixture(scope='function', autouse=True)
def session(db):
    connection = db.engine.connect()
    transaction = connection.begin()

    options = dict(bind=connection, binds={})
    session_ = db.create_scoped_session(options=options)

    db.session = session_

    yield session_

    transaction.rollback()
    connection.close()
    session_.remove()
