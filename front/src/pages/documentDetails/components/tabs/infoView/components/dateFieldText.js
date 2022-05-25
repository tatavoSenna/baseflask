import moment from 'moment'
import React from 'react'
import { StyledLabel, StyledValue } from './styles/style'

import { object } from 'prop-types'

const DateFieldText = ({ data }) => (
	<>
		<StyledLabel>{data.label || data.variable.name}</StyledLabel>
		<StyledValue>{moment(data.initialValue).format('DD-MM-YYYY')}</StyledValue>
	</>
)

DateFieldText.propTypes = {
	data: object,
}

export default DateFieldText
