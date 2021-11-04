import logging
from num2words import num2words

class NumberFormatter:

    def __init__(self, value, default_display_style=None):
        
        self._default_display_style = default_display_style
        self._value = value


    def __str__(self):
        if self._default_display_style:
            try:
                return getattr(self, self._default_display_style)
            except Exception as e:
                logging.exception(e)
        else:
            return self.default

    @property
    def extended(self):
        try:
            return f'{self._value} ({num2words(self._value, lang="pt_BR")})'
        except Exception as e:
            logging.exception(e)

    @property
    def ordinal(self):
        try:
            return f'{num2words(self._value, lang="pt_BR", to="ordinal")}'
        except Exception as e:
            logging.exception(e)

    @property
    def percent(self):
        try:
            return f'{self._value}% ({num2words(self._value, lang="pt_BR")} por cento)'
        except Exception as e:
            logging.exception(e)

    @property
    def default(self):
        try:
            return str(self._value)
        except Exception as e:
            logging.exception(e)
