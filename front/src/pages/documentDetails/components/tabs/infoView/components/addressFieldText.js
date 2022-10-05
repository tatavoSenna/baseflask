import React from 'react'
import PropTypes from 'prop-types'

import { StyledTitle, StyledLabel, StyledValue } from './styles/style'

const AddressFieldText = ({ data }) => {
	const addressProperties = [
		{ name: 'STREET', label: 'Logradouro' },
		{ name: 'NUMBER', label: 'Número' },
		{ name: 'COMPLEMENT', label: 'Complemento' },
		{ name: 'DISTRICT', label: 'Bairro' },
		{ name: 'CITY', label: 'Cidade' },
		{ name: 'STATE', label: 'Estado' },
		{ name: 'COUNTRY', label: 'País' },
		{ name: 'CEP', label: 'cep' },
	]

	return (
		<>
			{data.field.label && <StyledTitle>{data.field.label}</StyledTitle>}
			{addressProperties.map(
				(addressProperty, i) =>
					addressProperty.name in data.value && (
						<div key={i}>
							<StyledLabel>{addressProperty.label}:</StyledLabel>
							<StyledValue>{data.value[addressProperty.name]}</StyledValue>
						</div>
					)
			)}
		</>
	)
}

AddressFieldText.propTypes = {
	data: PropTypes.object,
}

export default AddressFieldText
