import React from 'react'
import { string, shape } from 'prop-types'
import { Form, DatePicker } from 'antd'

const DateField = ({ pageFieldsData }) => {
	const { value, variable, type, id } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={value}
			type={type}
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
