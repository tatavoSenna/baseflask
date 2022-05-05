import React from 'react'
import PropTypes from 'prop-types'

import { StyledTitle, StyledLabel, StyledValue } from './styles/style'

const AddressFieldText = ({ data }) => {
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

	let dataAddressUsed = []
	for (let i = 0; i < address.length; i++) {
		for (let j = 0; j < allUsableData.length; j++) {
			if (address[i].field_type === allUsableData[j].field_type) {
				address[i].value = allUsableData[j].value
				dataAddressUsed.push(address[i])
				break
			}
		}
	}

	return (
		<>
			<StyledTitle>{data.subtitle}</StyledTitle>
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
