import React from 'react'
import { string, shape, array, object, func } from 'prop-types'
import { Form, Radio } from 'antd'

const RadioField = ({ pageFieldsData, className, onChange }) => {
	const { value, variable, type, options, id } = pageFieldsData
	return (
		<Form.Item
			key={`${variable}_${id}`}
			name={variable}
			label={value}
			className={className}
			hasFeedback
			rules={
				className !== 'inputFactory_hidden__18I0s' && [
					{ required: true, message: 'Este campo é obrigatório.' },
				]
			}
			type={type}
			colon={false}>
			<Radio.Group>
				{options.map((option, index) => (
					<Radio key={index} value={option} onChange={onChange}>
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
	className: object,
	onChange: func,
}

RadioField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default RadioField
