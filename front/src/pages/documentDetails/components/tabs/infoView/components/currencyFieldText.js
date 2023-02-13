import React from 'react'
import { object } from 'prop-types'

import { StyledLabel, StyledValue } from './styles/style'

const CurrencyFieldText = ({ data }) => {
	// formatting float value in brazilian currency
	const currencyFormated = data.value
		.toFixed(2)
		.replace(/\./, ',')
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.') // putting a dot after 3 numbers

	return (
		<div>
			{data.field.label && <StyledLabel>{data.field.label}:</StyledLabel>}
			<StyledValue>R$ {currencyFormated}</StyledValue>
		</div>
	)
}

CurrencyFieldText.propTypes = {
	data: object,
}

export default CurrencyFieldText
