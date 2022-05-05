import React from 'react'
import PropTypes from 'prop-types'

import { StyledTitle, StyledLabel, StyledValue } from './styles/style'

const AddressFieldText = ({ data }) => {
	const address = {
		cep: { field_type: 'cep', label: 'CEP', value: '' },
		country: { field_type: 'country', label: 'País', value: '' },
		number: { field_type: 'number', label: 'Número', value: '' },
		street: { field_type: 'street', label: 'Logradouro', value: '' },
		complement: { field_type: 'complement', label: 'Complemento', value: '' },
		city: { field_type: 'city', label: 'Cidade', value: '' },
		state: { field_type: 'state', label: 'Estado', value: '' },
	}

	let dataAddressUsed = []
	data.fields.map((field) => {
		address[field].value = data.initialValue[field]
		return dataAddressUsed.push(address[field])
	})

	return (
		<>
			<StyledTitle>{data.label}</StyledTitle>
			{dataAddressUsed.map((d, i) => (
				<div key={i}>
					<StyledLabel>{d.label}</StyledLabel>
					<StyledValue>{d.value}</StyledValue>
				</div>
			))}
		</>
	)
}

AddressFieldText.propTypes = {
	data: PropTypes.object,
}

export default AddressFieldText
