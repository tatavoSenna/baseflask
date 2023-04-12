import React from 'react'
import PropTypes from 'prop-types'

import {
	StyledTitle,
	StyledLabel,
	StyledValue,
	StyledPanel,
	StyledCollapse,
} from './styles/style'

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

const addressProps = [
	{ name: 'STREET', label: 'Logradouro' },
	{ name: 'NUMBER', label: 'Número' },
	{ name: 'COMPLEMENT', label: 'Complemento' },
	{ name: 'DISTRICT', label: 'Bairro' },
	{ name: 'CITY', label: 'Cidade' },
	{ name: 'STATE', label: 'Estado' },
	{ name: 'COUNTRY', label: 'País' },
	{ name: 'CEP', label: 'cep' },
]

const naturalPersonProps = [
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
	...addressProps,
]

const legalPersonProps = [
	{ name: 'LEGAL_NATIONALITY', label: 'Nacionalidade' },
	{ name: 'SOCIETY_NAME', label: 'Razão Social' },
	{ name: 'CNPJ', label: 'CNPJ' },
	{ name: 'ACTIVITY', label: 'Área da atividade' },
	...addressProps,
]

const PersonFieldText = ({ data }) => {
	const { field, value } = data

	return (
		<>
			{field.label && <StyledTitle $margin="10px 0">{field.label}</StyledTitle>}
			{field.person_list ? (
				<StyledCollapse bordered={false}>
					{value.map((val, i) => (
						<StyledPanel
							header={
								val.SOCIETY_NAME ||
								val.PRONOUN + ' ' + val.NAME + ' ' + val.SURNAME
							}
							key={i}>
							<PersonField
								{...data}
								value={val}
								key={i}
								personProperties={
									val.PERSON_TYPE === 'natural_person'
										? naturalPersonProps
										: legalPersonProps
								}
							/>
						</StyledPanel>
					))}
				</StyledCollapse>
			) : (
				<PersonField
					{...data}
					personProperties={
						value.PERSON_TYPE === 'natural_person'
							? naturalPersonProps
							: legalPersonProps
					}
				/>
			)}
		</>
	)
}

const PersonField = ({ value, personProperties }) => {
	const hasAttorney =
		Object.keys(value).filter((property) => property.includes('ATTORNEY'))
			.length > 0

	return (
		<>
			{personProperties?.map(
				(personProperty, i) =>
					personProperty.name in value && (
						<div key={i}>
							{value[personProperty.name] !== '' && (
								<>
									<StyledLabel>{personProperty.label}:</StyledLabel>
									<StyledValue>{value[personProperty.name]}</StyledValue>
								</>
							)}
						</div>
					)
			)}
			{hasAttorney && <StyledTitle>Procurador</StyledTitle>}
			{hasAttorney &&
				attorneyProperties.map(
					(attorneyProperty, i) =>
						attorneyProperty.name in value && (
							<div key={i}>
								<StyledLabel>{attorneyProperty.label}:</StyledLabel>
								<StyledValue>{value[attorneyProperty.name]}</StyledValue>
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

PersonField.propTypes = {
	value: PropTypes.object,
	personProperties: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}
