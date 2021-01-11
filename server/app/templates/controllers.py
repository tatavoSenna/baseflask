
from app import db
from app.models.documents import DocumentTemplate

def create_template_controller(company_id, name, form, workflow, signers):

    document_template = DocumentTemplate(
        company_id=company_id,
        name=name,
        form=form,
        workflow=workflow,
        signers=signers,
        filetype="pdf"
    )

    db.session.add(document_template)
    db.session.commit()
    return document_template.id