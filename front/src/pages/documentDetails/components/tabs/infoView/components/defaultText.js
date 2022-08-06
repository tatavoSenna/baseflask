import React from 'react'
import { object } from 'prop-types'

import { StyledLabel, StyledValue } from './styles/style'

const DefaultText = ({ data }) => {
	const label = data.label || data?.variable?.name
	return (
		<div>
			{label && <StyledLabel>{label}:</StyledLabel>}
			<StyledValue>{data.initialValue}</StyledValue>
		</div>
	)
}

DefaultText.propTypes = {
	data: object,
}

export default DefaultText
