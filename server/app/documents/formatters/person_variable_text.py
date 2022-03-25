NaturalPersonTextVariable = {
    "PRONOUN": "{{ PRONOUN }}",
    "NAME": "{{ NAME }},",
    "NATIONALITY": "{{ NATIONALITY }}, ",
    "CIVIL_STATUS": "{{ CIVIL_STATUS }}, ",
    "PROPERTY_REGIME": "no regime de {{ PROPERTY_REGIME }}, ",
    "PROFESSION": "{{ PROFESSION }}, ",
    "RG": 'inscrit{{ "o" if PRONOUN == "Sr." else "a" if PRONOUN == "Sra." else "e" if PRONOUN == "Sre." }} no RG sob o nº {{ RG }}, ',
    "RG_EMISSION": "emitido por {{ RG_EMISSION }}, ",
    "RG_EMISSION_DATE": "em {{ RG_EMISSION_DATE }}, ",
    "CPF": 'inscrit{{ "o" if PRONOUN == "Sr." else "a" if PRONOUN == "Sra." else "e" if PRONOUN == "Sre." }} no CPF sob o nº {{ CPF }}, ',
    "EMAIL": "com email {{ EMAIL }}, ",
    "STREET": "residente à {{ STREET }}, ",
    "NUMBER": "{{ NUMBER }} ",
    "CITY": "{{ CITY }}/ ",
    "COMPLEMENT": "{{ COMPLEMENT }} - ",
    "STATE": "{{ STATE }} - ",
    "CEP": "{{ CEP }}, ",
    "COUNTRY": "{{ COUNTRY }} ",
}
NaturalPersonText = "{{ PRONOUN }}{{ NAME }}{{ NATIONALITY }}{{ CIVIL_STATUS }}{{ PROPERTY_REGIME }}{{ PROFESSION }}{{ RG }}{{ RG_EMISSION }}{{ RG_EMISSIONDATE }}{{ CPF }}{{ EMAIL }}{{ STREET }}{{ NUMBER }}{{ COMPLEMENT }}{{ CITY }}{{ STATE }}{{ CEP }}{{ COUNTRY }}"

LegalPersonTextVariable = {
    "SOCIETY_NAME": "{{ SOCIETY_NAME }}, ",
    "SOCIETY_TYPE": "{{ SOCIETY_TYPE }}, ",
    "ACTIVITY_AREA": "atuante na área de {{ ACTIVITY_TYPE }}, ",
    "CNPJ": "inscrito no CNPJ sob o nº {{ CNPJ }}, ",
    "EMAIL": "com email {{ EMAIL }}, ",
    "STREET": "sediada à {{ STREET }}, ",
    "NUMBER": "{{ NUMBER }} - ",
    "CITY": "{{ CITY }}/ ",
    "COMPLEMENT": "{{ COMPLEMENT }} - ",
    "STATE": "{{ STATE }} - ",
    "CEP": "{{ CEP }}, ",
    "COUNTRY": "{{ COUNTRY }} ",
}
LegalPersonText = "{{ SOCIETY_NAME }}{{ SOCIETY_TYPE }}{{ ACTIVITY_TYPE }}{{ CNPJ }}{{ EMAIL }}{{ STREET }}{{ NUMBER }}{{ COMPLEMENT }}{{ CITY }}{{ STATE }}{{ CEP }}{{ COUNTRY }}"
