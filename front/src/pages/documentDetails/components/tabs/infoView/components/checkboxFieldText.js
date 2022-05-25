import React from 'react'
import { StyledLabel, StyledValue, StyledWrapperBox } from './styles/style'

import { object } from 'prop-types'

const CheckBoxFieldText = ({ data }) => {
	return (
		<>
			<StyledLabel>{data.label || data.variable.name}:</StyledLabel>
			<StyledWrapperBox>
				{data.initialValue.map((value) => (
					<StyledValue key={data.label + value}>- {value}</StyledValue>
				))}
			</StyledWrapperBox>
		</>
	)
}

CheckBoxFieldText.propTypes = {
	data: object,
}

export default CheckBoxFieldText
