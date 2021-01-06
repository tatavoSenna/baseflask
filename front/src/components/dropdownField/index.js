import React from 'react'
import { string, shape, array } from 'prop-types'
import { Form, Select } from 'antd'

const DropdownField = ({ pageFieldsData }) => {
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
			<Select>
				{options.map((option, index) => (
					<Select.Option key={index} value={option}>
						{option}
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	)
}

DropdownField.propTypes = {
	pageFieldsData: shape({
		value: string.isRequired,
		variable: string.isRequired,
		type: string.isRequired,
		options: array.isRequired,
	}).isRequired,
}

export default DropdownField
