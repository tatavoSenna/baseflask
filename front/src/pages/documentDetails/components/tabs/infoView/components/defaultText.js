import React from 'react'
import { object } from 'prop-types'

import { StyledLabel, StyledValue } from './styles/style'

const DefaultText = ({ data }) => {
	return (
		<div>
			{data.field.label && <StyledLabel>{data.field.label}:</StyledLabel>}
			<StyledValue>{data.value}</StyledValue>
		</div>
	)
}

DefaultText.propTypes = {
	data: object,
}

export default DefaultText
