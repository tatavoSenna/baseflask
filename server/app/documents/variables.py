from datetime import datetime
from app.models.documents import DocumentTemplate
from app import jinja_env
import requests
import json
from flask import Markup
from num2words import num2words
from babel.numbers import format_currency


def specify_variables(variables, document_template_id):
    variables_specification = DocumentTemplate.query.get(
        document_template_id).variables
    text_type = DocumentTemplate.query.get(document_template_id).text_type

    def format_variable(specs, variable, variables, struct_name):
        variable_type = specs["type"]
        if variable_type == "string":
            if specs["doc_display_style"] == "sentence_case":
                return variables[variable].capitalize()

            elif specs["doc_display_style"] == "uppercase":
                return variables[variable].upper()

            elif specs["doc_display_style"] == "lowercase":
                return variables[variable].lower()

            elif specs["doc_display_style"] == "plain":
                return variables[variable]

        elif variable_type == "number":
            if specs["doc_display_style"] == "extended":
                return num2words(variables[variable], lang="pt_BR")

            elif specs["doc_display_style"] == "plain":
                return variables[variable]

        elif variable_type == "date":
            date = datetime.strptime(variables[variable][0:10], "%Y-%m-%d")
            return date.strftime(specs["doc_display_style"])

        elif variable_type == "database":
            response = requests.get(
                f'https://n66nic57s2.execute-api.us-east-1.amazonaws.com/dev/extract/{variables[variable]}').json()
            variables = {**variables, **response}
            return True

        elif variable_type == "list":
            if specs["doc_display_style"] == "commas":
                list_variable = variables[variable]
                last_element = list_variable.pop()
                list_variable[-1] = list_variable[-1] + " e " + last_element
                return ", ".join(list_variable)

            elif specs["doc_display_style"] == "bullets":
                if text_type == ".txt":
                    return Markup(
                        "</li><p>").join(variables[variable])

                elif text_type == ".docx":
                    return "\a".join(variables[variable])

        elif variable_type == "currency":
            num_variable = variables[variable]
            if specs["doc_display_style"] == "currency_extended":
                return format_currency(num_variable, "BRL", locale='pt_BR') + \
                    " (" + num2words(num_variable, lang='pt_BR', to='currency') + ")"
            return format_currency(
                num_variable, "BRL", locale='pt_BR')

        elif variable_type == "person":
            items = variables[struct_name]
            if items['PERSON_TYPE'] == 'Física':
                person_type = 'natural'
            elif items['PERSON_TYPE'] == 'Jurídica':
                person_type = 'legal'
            text_template = specs["doc_display_style"][person_type]
            jinja_template = jinja_env.from_string(text_template)
            filled_text = jinja_template.render(items)
            return filled_text

        elif variable_type[0:11] == "structured_":
            if specs["doc_display_style"] == "text":
                rows_list = []
                text_template = specs["extra_style_params"]["row_template"]
                jinja_template = jinja_env.from_string(text_template)
                for item in variables[struct_name]:
                    filled_text = jinja_template.render(item)
                    rows_list.append(filled_text)

                return specs["extra_style_params"]["separator"].join(rows_list)

            elif specs["doc_display_style"] == "table":
                table_list = []
                table_title = specs["extra_style_params"]["title"]
                i = 0
                for item in variables[struct_name]:
                    table_rows = [
                        f"<tr><td><p>{table_title.format(i+1)}</p></td></tr>"]
                    i += 1
                    for lineSpec in specs["extra_style_params"]["lines"]:
                        columns = []
                        for info in lineSpec:
                            for label, value in info.items():
                                columns.append(
                                    f"<td>{label}</td><td>{item[value]}</td>")
                        table_rows.append('<tr>' + ''.join(columns) + '</tr>')

                    table_list.append(''.join(table_rows))

                return "<figure class='table'><table><tbody>" + "".join(table_list) + "</tbody></table></figure>"

    if not variables_specification:
        return variables

    extra_variables = {}

    for variable in variables:
        if not variable in variables_specification:
            continue

        if variable[0:11] == 'structured_':

            for index, item in enumerate(variables[variable]):
                for variable_name, specs in variables_specification[variable]['structure'].items():
                    formatted = format_variable(
                        specs, variable_name, item, struct_name=None)
                    variables[variable][index][variable_name] = formatted

            for variable_name, specs in variables_specification[variable]['main'].items():
                formatted = format_variable(
                    specs, variable_name, variables, variable)
                extra_variables[variable_name] = formatted

        elif variable[0:6] == 'person':
            for variable_name, specs in variables_specification[variable].items():
                formatted = format_variable(
                    specs, variable_name, variables, variable)
                extra_variables[variable_name] = formatted

        else:
            formatted = format_variable(
                variables_specification[variable], variable, variables, struct_name=None)
            variables[variable] = formatted

    variables.update(extra_variables)
    return variables
