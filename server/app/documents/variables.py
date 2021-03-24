from datetime import datetime
from app.models.documents import DocumentTemplate

def specify_variables(variables, document_template_id):
    variables_specification = DocumentTemplate.query.get(document_template_id).variables

    if not variables_specification:
        return variables
    
    for variable in variables:
        if not variable in variables_specification:
            continue
        if variables_specification[variable]["type"] == "date":
            date = datetime.strptime(variables[variable][0:10], "%Y-%m-%d")
            variables[variable] = date.strftime(variables_specification[variable]["doc_display_style"])
        else:
            pass

    return variables