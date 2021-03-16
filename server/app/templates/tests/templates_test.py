import pytest
from app.test import factories
from app.templates.controllers import (
    create_template_controller,
    get_template_controller,
    delete_template_controller
)
from unittest.mock import patch


@ patch('app.templates.controllers.RemoteTemplate.upload_template')
def test_create_template_controller(upload_template_mock):
    name = "New Template"
    form = [{"form": "new form"}]
    workflow = {"workflow": "new workflow"}
    signers = [{"signers": "new signers"}]
    template_text = [{"text": "file text"}]
    company = factories.CompanyFactory(id=777)
    user = factories.UserFactory(
        id=7, company=company, email="testemail@gmail.com", company_id=company.id
    )

    template_id = create_template_controller(
        user.company_id, user.id, name, form, workflow, signers, template_text, ".txt")

    upload_template_mock.assert_called_once_with(
        template_text, template_id)

    assert template_id == 1


@ patch('app.templates.controllers.RemoteTemplate.delete_template')
def test_delete_template(delete_template_mock):
    company = factories.CompanyFactory(id=17)
    template = factories.DocumentTemplateFactory(id=77, company=company)
    ret_template = get_template_controller(template.company.id, template.id)
    delete_template_controller(ret_template)

    assert get_template_controller(17, 77) == None
    delete_template_mock.assert_called_once_with(
        ret_template
    )
