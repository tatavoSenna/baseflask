import pytest
from app.test import factories

from app.models.documents import DocumentTemplate
from app.documents.controllers import (
    get_document_template_list_controller,
    get_document_template_details_controller,
)


def test_retrieve_document_templates_list():
    company_1_id = 134
    company_2_id = 144
    company_1 = factories.CompanyFactory(id=company_1_id)
    company_2 = factories.CompanyFactory(id=company_2_id)
    factories.DocumentTemplateFactory(company=company_1, published=True)
    factories.DocumentTemplateFactory(company=company_1, published=True)
    factories.DocumentTemplateFactory(company=company_2, published=True)
    retrieved_list = get_document_template_list_controller(company_1_id)
    assert len(retrieved_list) == 2


def test_retrieve_document_template_details():
    company_id = 134
    company = factories.CompanyFactory(id=company_id)
    document_template = factories.DocumentTemplateFactory(
        company=company, form={"test": 123}
    )
    retrieved_template = get_document_template_details_controller(
        company_id, document_template.id
    )
    assert retrieved_template.company_id == company_id
    assert retrieved_template.id == document_template.id
    assert retrieved_template.form == document_template.form
