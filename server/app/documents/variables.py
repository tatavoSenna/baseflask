from datetime import datetime
from app.models.documents import DocumentTemplate
import requests
import json
from flask import Markup

def specify_variables(variables, document_template_id):
    variables_specification = DocumentTemplate.query.get(document_template_id).variables
    text_type = DocumentTemplate.query.get(document_template_id).text_type

    if not variables_specification:
        return variables
    
    for variable in variables:
        if not variable in variables_specification:
            continue
        if variables_specification[variable]["type"] == "string":
            if variables_specification[variable]["doc_display_style"] == "sentence_case":
                variables[variable] = variables[variable].capitalize()
            if variables_specification[variable]["doc_display_style"] == "uppercase":
                variables[variable] = variables[variable].upper()
            if variables_specification[variable]["doc_display_style"] == "lowercase":
                variables[variable] = variables[variable].lower()
        if variables_specification[variable]["type"] == "date":
            date = datetime.strptime(variables[variable][0:10], "%Y-%m-%d")
            variables[variable] = date.strftime(variables_specification[variable]["doc_display_style"])
        elif variables_specification[variable]["type"] == "database":
            response = requests.get(f'https://n66nic57s2.execute-api.us-east-1.amazonaws.com/dev/extract/{variables[variable]}').json()
            variables = {**variables, **response}
        elif variables_specification[variable]["type"] == "list":
            if variables_specification[variable]["doc_display_style"] == "commas":
                list_variable = variables[variable]
                last_element = list_variable.pop()
                list_variable[-1] = list_variable[-1] + " e " + last_element
                variables[variable] = ", ".join(list_variable)
            elif variables_specification[variable]["doc_display_style"] == "bullets":
                if text_type == ".txt":
                    variables[variable] = Markup("</li><li>").join(variables[variable])
                elif text_type == ".docx":
                    variables[variable] = "\a".join(variables[variable])
        else:
            pass
 
    return variables