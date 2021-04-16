import React from 'react'
import { string, shape, array, object, func } from 'prop-types'
import { Form, Radio } from 'antd'

const RadioField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, type, options, id } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={label}
			className={className}
			hasFeedback
			rules={
				typeof className === 'string' &&
				className.slice(0, 19) !== 'inputFactory_hidden' && [
					{ required: true, message: 'Este campo é obrigatório.' },
				]
			}
			type={type}
			colon={false}>
			<Radio.Group>
				{options.map((option, index) => (
					<Radio key={index} value={option.value} onChange={onChange}>
						{option.label}
					</Radio>
				))}
			</Radio.Group>
		</Form.Item>
	)
}

RadioField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
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
