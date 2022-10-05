import moment from 'moment'
import React from 'react'
import { StyledLabel, StyledValue } from './styles/style'

import { object } from 'prop-types'

const DateFieldText = ({ data }) => (
	<>
		{data.field.label && <StyledLabel>{data.field.label}:</StyledLabel>}
		<StyledValue>{moment(data.value).format('DD-MM-YYYY')}</StyledValue>
	</>
)

DateFieldText.propTypes = {
	data: object,
}

export default DateFieldText
