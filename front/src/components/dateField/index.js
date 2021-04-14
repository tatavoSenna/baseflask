import React from 'react'
import { string, shape } from 'prop-types'
import { Form, DatePicker } from 'antd'

const DateField = ({ pageFieldsData }) => {
	const { label, variable, type, id } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			type={type}
			label={label}
			hasFeedback
			rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
			colon={false}>
			<DatePicker format={'DD-MM-YYYY'} placeholder={''} />
		</Form.Item>
	)
}

DateField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: string.isRequired,
	}).isRequired,
}

export default DateField
