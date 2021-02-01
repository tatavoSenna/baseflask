import pytest
from app.test import factories
from app.templates.controllers import (
    create_template_controller
)
from unittest.mock import patch

@ patch('app.templates.controllers.RemoteTemplate.upload_template')
def test_create_template_controller(upload_template_mock):
    name = "New Template"
    form = [{"form":"new form"}]
    workflow = {"workflow":"new workflow"}
    signers = [{"signers":"new signers"}]
    template_text = [{"text":"file text"}]
    company = factories.CompanyFactory()
    user = factories.UserFactory(
        company=company, email="testemail@gmail.com"
    )

    template_id = create_template_controller(user.company_id, name, form, workflow, signers, template_text)

    upload_template_mock.assert_called_once_with(template_text, template_id)

    assert template_id == 1
     
