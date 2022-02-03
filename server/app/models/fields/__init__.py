import sqlalchemy.types as types


class StringChoiceField(types.TypeDecorator):
    """
    Database field that accepts multiple string choices.
    refs: https://stackoverflow.com/questions/6262943/sqlalchemy-how-to-make-django-choices-using-sqlalchemy
          https://docs.sqlalchemy.org/en/14/core/custom_types.html#overriding-type-compilation
    """

    impl = types.String

    def __init__(self, choices: list, **kwargs):
        self.choices = set(choices)
        super().__init__(**kwargs)

    def process_bind_param(self, value: str, dialect):
        if value is None:
            return None
        if value not in self.choices:
            raise ValueError(f'Choice "{value}" is not permitted')
        return value

    def process_result_value(self, value: str, dialect):
        if value is None:
            return None
        if value not in self.choices:
            raise ValueError(f'Choice "{value}" is not permitted')
        return value
