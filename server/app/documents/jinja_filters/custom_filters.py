from app.documents.formatters.currency_formatter import CurrencyFormatter


def currency_plain(value):
    return CurrencyFormatter(value).plain


def currency_extended(value):
    return CurrencyFormatter(value).extended


def env_custom_filters():
    env_dict = {}
    env_dict["currency_plain"] = currency_plain
    env_dict["currency_extended"] = currency_extended

    return env_dict
