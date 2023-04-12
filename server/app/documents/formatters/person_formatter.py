from app.documents.formatters.person_variable_text import (
    LegalPersonText,
    LegalPersonTextVariable,
    NaturalPersonText,
    NaturalPersonTextVariable,
)

from app import jinja_env


class PersonList(list):
    def __init__(self, variables, text):
        super().__init__(variables)
        self.TEXT = text

    def __str__(self):
        return self.TEXT


class PersonDict(dict):
    def __init__(self, variables, text):
        super().__init__(variables)
        self.TEXT = text

    def __str__(self):
        return self.TEXT


def create_person_variable(variables):
    if type(variables) == list:
        person_list = [text_formatter(variable) for variable in variables]

        filled_text = ", ".join(person_list)

        return PersonList(variables, filled_text)
    else:
        return PersonDict(variables, text_formatter(variables))


def text_formatter(variables):
    text_variable = {}

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
