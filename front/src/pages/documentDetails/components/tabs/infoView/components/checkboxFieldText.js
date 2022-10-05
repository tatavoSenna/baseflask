import React from 'react'
import { StyledLabel, StyledValue, StyledWrapperBox } from './styles/style'

import { object } from 'prop-types'

const CheckBoxFieldText = ({ data }) => {
	return (
		<>
			{data.field.label && <StyledLabel>{data.field.label}:</StyledLabel>}
			<StyledWrapperBox>
				{data.value.map((value) => (
					<StyledValue key={data.field.label + value}>- {value}</StyledValue>
				))}
			</StyledWrapperBox>
		</>
	)
}

CheckBoxFieldText.propTypes = {
	data: object,
}

export default CheckBoxFieldText
