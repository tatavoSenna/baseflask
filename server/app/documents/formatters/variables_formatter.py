import requests
import logging

from datetime import datetime
from slugify import slugify
from flask import Markup
from num2words import num2words
from babel.numbers import format_currency

from app import jinja_env
from app.models.documents import DocumentTemplate
from app.documents.formatters.structured_list_formatter import StructuredListFormatter
from app.documents.formatters.number_formatter import NumberFormatter
from app.documents.formatters.time_formatter import TimeFormatter
from app.documents.formatters.internal_database_formatter import (
    InternalDatabaseFormatter,
)
from app.documents.formatters.person_variable_text import (
    LegalPersonText,
    LegalPersonTextVariable,
    NaturalPersonText,
    NaturalPersonTextVariable,
)


month_dictionary = {
    1: "Janeiro",
    2: "Fevereiro",
    3: "Março",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro",
}


def format_variables(variables, document_template_id):
    # TODO: Calling the database twice
    variables_specification = DocumentTemplate.query.get(document_template_id).variables
    text_type = DocumentTemplate.query.get(document_template_id).text_type

    def format_variable(specs, variable):
        variable_type = specs["type"]
        if variable_type == "string":
            if specs["doc_display_style"] == "sentence_case":
                try:
                    return variable.capitalize()
                except Exception as e:
                    logging.exception(e)

            elif specs["doc_display_style"] == "uppercase":
                try:
                    return variable.upper()
                except Exception as e:
                    logging.exception(e)

            elif specs["doc_display_style"] == "lowercase":
                try:
                    return variable.lower()
                except Exception as e:
                    logging.exception(e)

            else:
                try:
                    return variable
                except Exception as e:
                    logging.exception(e)

        elif variable_type == "number":
            return NumberFormatter(variable, specs.get("doc_display_style", None))

        elif variable_type == "percentage":
            if specs["doc_display_style"] == "extended":
                try:
                    return num2words(variable, lang="pt_BR") + " porcento"
                except Exception as e:
                    logging.exception(e)
            elif specs["doc_display_style"] == "plain":
                try:
                    return str(variable).replace(".", ",") + "%"
                except Exception as e:
                    logging.exception(e)

        elif variable_type == "date":
            if specs["doc_display_style"] in ["date_extended", "extended"]:
                try:
                    list = variable[0:10].split("-", 2)
                    dia = list[2]
                    mes = month_dictionary.get(int(list[1].strip("0")))
                    ano = list[0]
                    if mes != None:
                        return f"{dia} de {mes} de {ano}"
                    else:
                        return datetime.strptime(variable[0:10], "%d de %B de %Y")
                except Exception as e:
                    logging.exception(e)
            else:
                try:
                    date = datetime.strptime(variable[0:10], "%Y-%m-%d")
                    return date.strftime(specs["doc_display_style"])
                except Exception as e:
                    logging.exception(e)

        elif variable_type == "time":
            return TimeFormatter(variable, specs.get("doc_display_style", None))

        elif variable_type == "database":
            try:
                response = requests.get(f'{specs["database_endpoint"]}/{variable}')

                new_variables = response.json()

                return new_variables
            except Exception as e:
                logging.exception(e)

        elif variable_type == "list":
            if specs["doc_display_style"] == "commas":
                try:
                    list_variable = variable
                    if len(list_variable) < 2:
                        return list_variable[0]
                    last_element = list_variable.pop()
                    list_variable[-1] = list_variable[-1] + " e " + last_element
                    return ", ".join(list_variable)
                except Exception as e:
                    logging.exception(e)

            elif specs["doc_display_style"] == "bullets":
                if text_type == ".txt":
                    try:
                        return Markup("</li><p>").join(variable)
                    except Exception as e:
                        logging.exception(e)

                elif text_type == ".docx":
                    try:
                        return "\a".join(variable)
                    except Exception as e:
                        logging.exception(e)

        elif variable_type == "currency":
            try:
                num_variable = variable
                if specs["doc_display_style"] in ["currency_extended", "extended"]:
                    return (
                        format_currency(num_variable, "BRL", locale="pt_BR")
                        + " ("
                        + num2words(num_variable, lang="pt_BR", to="currency")
                        + ")"
                    )
                return format_currency(num_variable, "BRL", locale="pt_BR")
            except Exception as e:
                logging.exception(e)

        elif variable_type[0:11] == "structured_":
            return StructuredListFormatter(variable, specs)

        elif variable_type == "internal_database":
            return InternalDatabaseFormatter(variable)

    if not variables_specification:
        return variables

    for variable_name in variables:
        if not variable_name in variables_specification:
            constants_variables_formatter(variables, variable_name, format_variable)
            continue

        if variables_specification[variable_name]["type"] == "structured_list":
            # This formats the variables from the structure
            structured_variables = []
            for item in variables[variable_name]:
                structured_item = {}
                for subvariable_name, specs in variables_specification[variable_name][
                    "structure"
                ].items():
                    structured_item[subvariable_name] = format_variable(
                        specs, item[subvariable_name]
                    )

                structured_variables.append(structured_item)

            # This inserts the structure variables inside the final structured object
            variables[variable_name] = format_variable(
                variables_specification[variable_name], structured_variables
            )

        elif variables_specification[variable_name]["type"] == "person":
            variables[variable_name]["TEXT"] = create_text_variable(
                variables[variable_name], "person"
            )

        elif variables_specification[variable_name]["type"] == "address":
            continue

        else:
            formatted = format_variable(
                variables_specification[variable_name], variables[variable_name]
            )
            variables[variable_name] = formatted

    return variables


def create_text_variable(variables, variable_type):
    text_variable = {}
    filled_text = ""
    if variable_type == "person":
        if variables["PERSON_TYPE"] == "legal_person":
            person_text_variable = LegalPersonTextVariable
            person_text = LegalPersonText
        else:
            person_text_variable = NaturalPersonTextVariable
            person_text = NaturalPersonText

        for value in variables:
            if value in person_text_variable:
                jinja_template = jinja_env.from_string(person_text_variable[value])
                filled_text = jinja_template.render(variables)
                text_variable[value] = filled_text

        jinja_template = jinja_env.from_string(person_text)
        filled_text = jinja_template.render(text_variable)
    return filled_text


# Formatting variables with don't have previously specifications
def constants_variables_formatter(variables, variable_name, format_variable):
    if variable_name == "DATA_GERACAO_CONTRATO":
        specifications = {"type": "date", "doc_display_style": ""}
        variable_value = variables[variable_name]

        variables[variable_name] = {}
        specifications["doc_display_style"] = "extended"
        variables[variable_name]["extenso"] = format_variable(
            specifications, variable_value
        )

        specifications["doc_display_style"] = "%d/%m/%Y"
        variables[variable_name]["curto"] = format_variable(
            specifications, variable_value
        )
