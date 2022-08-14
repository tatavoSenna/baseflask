import logging

from num2words import num2words
from sentry_sdk import capture_exception

from app.models.internal_database import TextItem


class InternalDatabaseFormatter:
    def __init__(self, text_ids):
        self._text_ids = text_ids

    def __str__(self):
        return self.default

    @property
    def default(self):
        text_descriptions = []
        try:
            for text_id in self._text_ids:
                text_descriptions.append(TextItem.query.get(text_id).description)
            return ",".join(text_descriptions)
        except Exception as e:
            logging.exception(e)

    @property
    def numbering(self):
        return_value = []
        try:
            for text_id in self._text_ids:
                # Doing too many queries. Optimize. Suggestion make 1 call with all ids
                return_value.append(TextItem.query.get(text_id).text)
            return return_value
        except Exception as e:
            capture_exception(e)
