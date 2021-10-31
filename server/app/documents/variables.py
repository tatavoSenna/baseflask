from datetime import datetime
from datetime import date
from app.models.documents import DocumentTemplate
from app import jinja_env
import requests
import json
import logging
from flask import Markup
from num2words import num2words
from babel.numbers import format_currency

month_dictionary = {1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril', 5: 'Maio', 6: 'Junho',
                    7: 'Julho', 8: 'Agosto', 9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'}


def specify_variables(variables, document_template_id):
    # TODO: Calling the database twice
    variables_specification = DocumentTemplate.query.get(
        document_template_id).variables
    text_type = DocumentTemplate.query.get(document_template_id).text_type

    def format_variable(specs, variable, variables, struct_name):
        variable_type = specs["type"]
        if variable_type == "string":
            if specs["doc_display_style"] == "sentence_case":
                try:
                    return variables[variable].capitalize()
                except Exception as e:
                    logging.exception(e)

            elif specs["doc_display_style"] == "uppercase":
                try:
                    return variables[variable].upper()
                except Exception as e:
                    logging.exception(e)

            elif specs["doc_display_style"] == "lowercase":
                try:
                    return variables[variable].lower()
                except Exception as e:
                    logging.exception(e)

            elif specs["doc_display_style"] == "plain":
                try:
                    return variables[variable]
                except Exception as e:
                    logging.exception(e)

        elif variable_type == "number":
            if specs["doc_display_style"] == "extended":
                try:
                    return f'{variables[variable]} ({num2words(variables[variable], lang="pt_BR")})'
                except Exception as e:
                    logging.exception(e)

            elif specs["doc_display_style"] == "ordinal":
                try:
                    return num2words(variables[variable], lang="pt_BR", to='ordinal')
                except Exception as e:
                    logging.exception(e)

            elif specs["doc_display_style"] == "plain":
                try:
                    return variables[variable]
                except Exception as e:
                    logging.exception(e)

        elif variable_type == "percentage":
            if specs["doc_display_style"] == "extended":
                try:
                    return num2words(variables[variable], lang="pt_BR") + " porcento"
                except Exception as e:
                    logging.exception(e)
            elif specs["doc_display_style"] == "plain":
                try:
                    return str(variables[variable]).replace(".", ",") + '%'
                except Exception as e:
                    logging.exception(e)

        elif variable_type == "date":
            if specs["doc_display_style"] in ["date_extended", "extended"]:
                try:
                    list = variables[variable][0:10].split("-", 2)
                    dia = list[2]
                    mes = month_dictionary.get(
                        int(list[1].strip("0")))
                    ano = list[0]
                    if mes != None:
                        return f'{dia} de {mes} de {ano}'
                    else:
                        return datetime.strptime(variables[variable][0:10], '%d de %B de %Y')
                except Exception as e:
                    logging.exception(e)
            else:
                try:
                    date = datetime.strptime(
                        variables[variable][0:10], "%Y-%m-%d")
                    return date.strftime(specs["doc_display_style"])
                except Exception as e:
                    logging.exception(e)

        elif variable_type == "database":
            try:
                response = requests.get(
                    f'https://n66nic57s2.execute-api.us-east-1.amazonaws.com/dev/extract/{variables[variable]}').json()
                variables = {**variables, **response}
                return True
            except Exception as e:
                logging.exception(e)

        elif variable_type == "list":
            if specs["doc_display_style"] == "commas":
                try:
                    list_variable = variables[variable]
                    if len(list_variable) < 2:
                        return list_variable[0]
                    last_element = list_variable.pop()
                    list_variable[-1] = list_variable[-1] + \
                        " e " + last_element
                    return ", ".join(list_variable)
                except Exception as e:
                    logging.exception(e)

            elif specs["doc_display_style"] == "bullets":
                if text_type == ".txt":
                    try:
                        return Markup(
                            "</li><p>").join(variables[variable])
                    except Exception as e:
                        logging.exception(e)

                elif text_type == ".docx":
                    try:
                        return "\a".join(variables[variable])
                    except Exception as e:
                        logging.exception(e)

        elif variable_type == "currency":
            try:
                num_variable = variables[variable]
                if specs["doc_display_style"] in ["currency_extended", "extended"]:
                    return format_currency(num_variable, "BRL", locale='pt_BR') + \
                        " (" + num2words(num_variable,
                                         lang='pt_BR', to='currency') + ")"
                return format_currency(
                    num_variable, "BRL", locale='pt_BR')
            except Exception as e:
                logging.exception(e)

        elif variable_type == "person":
            try:
                items = variables[struct_name]
                if items['PERSON_TYPE'] == 'Física':
                    person_type = 'natural'
                elif items['PERSON_TYPE'] == 'Jurídica':
                    person_type = 'legal'
                text_template = specs["doc_display_style"][person_type]
                jinja_template = jinja_env.from_string(text_template)
                filled_text = jinja_template.render(items)
                return filled_text
            except Exception as e:
                logging.exception(e)

        elif variable_type[0:11] == "structured_":
            if specs["doc_display_style"] == "text":
                try:
                    rows_list = []
                    text_template = specs["extra_style_params"]["row_template"]
                    jinja_template = jinja_env.from_string(text_template)
                    for index, item in enumerate(variables[struct_name]):
                        item['INDEX'] = index + 1
                        filled_text = jinja_template.render(item)
                        rows_list.append(filled_text)

                    return specs["extra_style_params"]["separator"].join(rows_list)
                except Exception as e:
                    logging.exception(e)

            elif specs["doc_display_style"] == "table":
                try:
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
                            table_rows.append(
                                '<tr>' + ''.join(columns) + '</tr>')

                        table_list.append(''.join(table_rows))

                    return "<figure class='table'><table><tbody>" + "".join(table_list) + "</tbody></table></figure>"
                except Exception as e:
                    logging.exception(e)

    if not variables_specification:
        return variables

    extra_variables = {}

    for variable in variables:
        if not variable in variables_specification:
            continue

        if variable[0:11] == 'structured_':

            # This first loop formats the variables from the structure
            for index, item in enumerate(variables[variable]):
                for variable_name, specs in variables_specification[variable]['structure'].items():
                    formatted = format_variable(
                        specs, variable_name, item, struct_name=None)
                    variables[variable][index][variable_name] = formatted

            # The second loop formats the main variables
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
