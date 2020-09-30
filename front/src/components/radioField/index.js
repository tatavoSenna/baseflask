import React from 'react'
import { string, shape, array } from 'prop-types'
import { Form, Radio } from 'antd'

const RadioField = ({ pageFieldsData }) => {
	const { value, variable, type, options, id } = pageFieldsData
	return (
		<Form.Item
			key={`${variable}_${id}`}
			name={variable}
			label={value}
			hasFeedback
			rules={[{ required: true, message: 'Este campo é obrigatório.' }]}
			type={type}
			colon={false}>
			<Radio.Group>
				{options.map((option, index) => (
					<Radio key={index} value={option}>
						{option}
					</Radio>
				))}
			</Radio.Group>
		</Form.Item>
	)
}

RadioField.propTypes = {
	pageFieldsData: shape({
		value: string.isRequired,
		variable: string.isRequired,
		type: string.isRequired,
		options: array.isRequired,
	}).isRequired,
}

export default RadioField
