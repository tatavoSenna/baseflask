import logging
from num2words import num2words


class TimeFormatter:
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
            hour_string = num2words(self._value[:2], lang="pt_BR")
            if self._value[11:13] == "01":
                h_complement_string = "a hora"
            else:
                h_complement_string = " horas"

            minute_string = num2words(self._value[3:5], lang="pt_BR")
            if self._value[14:16] == "01":
                m_complement_string = " minuto"
            else:
                m_complement_string = " minutos"

            if minute_string == "zero":
                return_string = hour_string + h_complement_string
            else:
                return_string = (
                    hour_string
                    + h_complement_string
                    + " e "
                    + minute_string
                    + m_complement_string
                )

            return return_string
        except Exception as e:
            logging.exception(e)

    @property
    def default(self):
        try:
            return str(self._value)
        except Exception as e:
            logging.exception(e)

    @property
    def plain(self):
        return self.default
