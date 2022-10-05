import React from 'react'
import PropTypes from 'prop-types'

import { StyledTitle, StyledLabel, StyledValue } from './styles/style'

const attorneyProperties = [
	{ name: 'ATTORNEY_NATIONALITY', label: 'Nacionalidade' },
	{ name: 'ATTORNEY_CPF', label: 'CPF' },
	{ name: 'ATTORNEY_PRONOUN', label: 'Pronome' },
	{ name: 'ATTORNEY_NAME', label: 'Nome' },
	{ name: 'ATTORNEY_SURNAME', label: 'Sobrenome' },
	{ name: 'ATTORNEY_IDENTITY', label: 'RG' },
	{ name: 'ATTORNEY_IDENTITY_ORG', label: 'Orgão exp' },
	{ name: 'ATTORNEY_IDENTITY_DATE', label: 'Data de exp' },
	{ name: 'ATTORNEY_EMAIL', label: 'E-mail' },
	{ name: 'ATTORNEY_PROFESSION', label: 'Profissão' },
	// attorney address
	{ name: 'ATTORNEY_STREET', label: 'Logradouro' },
	{ name: 'ATTORNEY_NUMBER', label: 'Número' },
	{ name: 'ATTORNEY_COMPLEMENT', label: 'Complemento' },
	{ name: 'ATTORNEY_CITY', label: 'Cidade' },
	{ name: 'ATTORNEY_STATE', label: 'Estado' },
	{ name: 'ATTORNEY_COUNTRY', label: 'País' },
	{ NAME: 'ATTORNEY_CEP', label: 'CEP' },
]

const personProperties = [
	{ name: 'SOCIETY_NAME', label: 'Razão Social' },
	{ name: 'CNPJ', label: 'CNPJ' },
	{ name: 'ACTIVITY', label: 'Área da atividade' },
	{ name: 'NATIONALITY', label: 'Nacionalidade' },
	{ name: 'CPF', label: 'CPF' },
	{ name: 'PRONOUN', label: 'Pronome' },
	{ name: 'NAME', label: 'Nome' },
	{ name: 'SURNAME', label: 'Sobrenome' },
	{ name: 'IDENTITY', label: 'RG' },
	{ name: 'IDENTITY_ORG', label: 'Orgão exp' },
	{ name: 'IDENTITY_DATE', label: 'Data de exp' },
	{ name: 'EMAIL', label: 'E-mail' },
	{ name: 'MARITAL_STATE', label: 'Estado Civil' },
	{ name: 'PROPERTY_REGIME', label: 'Regime de bens' },
	{ name: 'PROFESSION', label: 'Profissão' },
	{ name: 'STREET', label: 'Logradouro' },
	{ name: 'NUMBER', label: 'Número' },
	{ name: 'COMPLEMENT', label: 'Complemento' },
	{ name: 'DISTRICT', label: 'Bairro' },
	{ name: 'CITY', label: 'Cidade' },
	{ name: 'STATE', label: 'Estado' },
	{ name: 'COUNTRY', label: 'País' },
	{ name: 'CEP', label: 'cep' },
]

const PersonFieldText = ({ data }) => {
	const hasAttorney =
		Object.keys(data.value).filter((property) => property.includes('ATTORNEY'))
			.length > 0

	return (
		<>
			{data.field.label && <StyledTitle>{data.field.label}</StyledTitle>}
			{personProperties.map(
				(personProperty, i) =>
					personProperty.name in data.value && (
						<div key={i}>
							<StyledLabel>{personProperty.label}:</StyledLabel>
							<StyledValue>{data.value[personProperty.name]}</StyledValue>
						</div>
					)
			)}
			{hasAttorney && <StyledTitle>Procurador</StyledTitle>}
			{hasAttorney &&
				attorneyProperties.map(
					(attorneyProperty, i) =>
						attorneyProperty.name in data.value && (
							<div key={i}>
								<StyledLabel>{attorneyProperty.label}:</StyledLabel>
								<StyledValue>{data.value[attorneyProperty.name]}</StyledValue>
							</div>
						)
				)}
		</>
	)
}

export default PersonFieldText

PersonFieldText.propTypes = {
	data: PropTypes.object,
}
