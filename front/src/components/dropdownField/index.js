import React from 'react'
import { string, shape, array, object, func } from 'prop-types'
import { Form, Select } from 'antd'

const DropdownField = ({ pageFieldsData, className, onChange }) => {
	const { value, variable, type, options, id } = pageFieldsData
	return (
		<Form.Item
			key={`${variable}_${id}`}
			name={variable}
			label={value}
			hasFeedback
			className={className}
			rules={
				className !== 'inputFactory_hidden__18I0s' && [
					{ required: true, message: 'Este campo é obrigatório.' },
				]
			}
			type={type}
			colon={false}>
			<Select>
				{options.map((option, index) => (
					<Select.Option key={index} value={option} onChange={onChange}>
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
	className: object,
	onChange: func,
}

DropdownField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default DropdownField
