import pytest
from app.test import factories

from app.models.documents import Document
from app.documents.controllers import get_document_controller

def test_retrieve_document():
    company_id = 134
    user_id = 115
    company = factories.CompanyFactory(id=company_id)
    user = factories.UserFactory(id=user_id, company=company)
    document = factories.DocumentFactory(company=company, user=user)
    retrieved_document = get_document_controller(document.id)
    assert retrieved_document.company_id == company_id
    assert retrieved_document.user_id == user_id
    
