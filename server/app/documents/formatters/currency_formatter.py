import logging
from babel.numbers import format_currency
from num2words import num2words


class CurrencyFormatter:
    def __init__(self, value, default_display_style=None):
        self._default_display_style = default_display_style
        self._value = value

    def __str__(self):
        if self._default_display_style:
            try:
                return getattr(self, self._default_display_style)
            except Exception as e:
                logging.exception(e)
                return self.plain
        else:
            return self.default

    @property
    def float(self):
        return self._value

    @property
    def default(self):
        return str(self._value)

    @property
    def plain(self):
        try:
            return format_currency(self._value, "BRL", locale="pt_BR")
        except Exception as e:
            logging.exception(e)

    @property
    def extended(self):
        try:
            return (
                format_currency(self._value, "BRL", locale="pt_BR")
                + " ("
                + num2words(self._value, lang="pt_BR", to="currency")
                + ")"
            )
        except Exception as e:
            logging.exception(e)

    @property
    def currency_extended(self):
        return self.extended
