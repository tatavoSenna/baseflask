import pytest
from app.test import factories
from app.templates.controllers import (
    create_template_controller
)

def test_create_template_controller():
    name = "New Template"
    form = [{"form":"new form"}]
    workflow = {"workflow":"new workflow"}
    signers = [{"signers":"new signers"}]
    company = factories.CompanyFactory()
    user = factories.UserFactory(
        company=company, email="testemail@gmail.com"
    )

    template_id = create_template_controller(user.company_id, name, form, workflow, signers)

    assert template_id == 1
     
