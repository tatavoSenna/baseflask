from datetime import datetime
from app.models.documents import DocumentTemplate
import requests
import json

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
        elif variables_specification[variable]["type"] == "database":
            response = requests.get(f'https://n66nic57s2.execute-api.us-east-1.amazonaws.com/dev/extract/{variables[variable]}').json()
            variables = {**variables, **response}
        else:
            pass
 
    return variables