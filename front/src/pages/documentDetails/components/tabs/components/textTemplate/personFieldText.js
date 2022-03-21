import React from 'react'
import PropTypes from 'prop-types'

import { StyledTitle, StyledLabel, StyledValue } from './styles/style'

const PersonFieldText = ({ data }) => {
	const allUsableData = data.items.filter(
		(d) => d.field_type !== 'variable_name'
	)

	const address = [
		{ field_type: 'country', label: 'País', value: '' },
		{ field_type: 'cep', label: 'CEP', value: '' },
		{ field_type: 'number', label: 'Número', value: '' },
		{ field_type: 'street', label: 'Logradouro', value: '' },
		{ field_type: 'complement', label: 'Complemento', value: '' },
		{ field_type: 'city', label: 'Cidade', value: '' },
		{ field_type: 'state', label: 'Estado', value: '' },
	]

	const legalPerson = [
		{ field_type: 'society_name', label: 'Razão Social', value: '' },
		{ field_type: 'cnpj', label: 'CNPJ', value: '' },
		...address,
	]

	const naturalPerson = [
		{ field_type: 'pronoun', label: 'Pronome', value: '' },
		{ field_type: 'name', label: 'Nome', value: '' },
		{ field_type: 'cpf', label: 'CPF', value: '' },
		...address,
	]

	let dataPerson = []
	if (data.person_type === 'natural_person') {
		dataPerson = naturalPerson
	} else {
		dataPerson = legalPerson
	}

	let dataPersonUsed = []
	for (let i = 0; i < dataPerson.length; i++) {
		for (let j = 0; j < allUsableData.length; j++) {
			if (dataPerson[i].field_type === allUsableData[j].field_type) {
				dataPerson[i].value = allUsableData[j].value
				dataPersonUsed.push(dataPerson[i])
				break
			}
		}
	}

	return (
		<>
			<StyledTitle>{data.subtitle}</StyledTitle>
			{dataPersonUsed.map((d, i) => (
				<div key={i}>
					<StyledLabel>{d.label}</StyledLabel>
					<StyledValue>{d.value}</StyledValue>
				</div>
			))}
		</>
	)
}

export default PersonFieldText

PersonFieldText.propTypes = {
	data: PropTypes.object,
}
