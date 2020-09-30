import React from 'react'
import { string, shape } from 'prop-types'
import { Form, Input } from 'antd'

const EmailField = ({ pageFieldsData }) => {
	const { value, variable, type, id } = pageFieldsData
	return (
		<Form.Item
			key={`${variable}_${id}`}
			name={variable}
			label={value}
			type={type}
			hasFeedback
			rules={[
				{ type, message: 'E-mail não é válido.' },
				{ required: true, message: 'Este campo é obrigatório.' },
			]}
			colon={false}>
			<Input placeholder="" />
		</Form.Item>
	)
}

EmailField.propTypes = {
	pageFieldsData: shape({
		value: string.isRequired,
		variable: string.isRequired,
		type: string.isRequired,
	}).isRequired,
}

export default EmailField
