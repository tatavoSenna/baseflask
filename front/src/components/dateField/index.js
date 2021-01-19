import React from 'react'
import { string, shape } from 'prop-types'
import { Form, DatePicker } from 'antd'

const DateField = ({ pageFieldsData }) => {
	const { value, variable, id } = pageFieldsData
	return (
		<Form.Item
			key={`${variable}_${id}`}
			name={variable}
			label={value}
			hasFeedback
			rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
			colon={false}>
			<DatePicker format={'DD-MM-YYYY'} placeholder={''} />
		</Form.Item>
	)
}

DateField.propTypes = {
	pageFieldsData: shape({
		value: string.isRequired,
		variable: string.isRequired,
	}).isRequired,
}

export default DateField
