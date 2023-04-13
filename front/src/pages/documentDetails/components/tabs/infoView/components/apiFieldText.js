import React from 'react'
import { object } from 'prop-types'
import { StyledLabel, StyledValue } from './styles/style'

const ApiFieldText = ({ data }) => {
	const { field, value } = data
	return (
		<div>
			{data.field.label && <StyledLabel>{field.label}:</StyledLabel>}
			<StyledValue>
				{typeof value === 'object' ? value.EXIBICAO : value}
			</StyledValue>
		</div>
	)
}

ApiFieldText.propTypes = {
	data: object,
}

export default ApiFieldText
