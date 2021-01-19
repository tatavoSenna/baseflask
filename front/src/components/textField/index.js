import React from 'react'
import { string, shape, object, func } from 'prop-types'
import { Form, Input } from 'antd'

const TextField = ({ pageFieldsData, inputValue, className, onChange }) => {
	const { value, variable, type, id } = pageFieldsData
	return (
		<Form.Item
			key={`${variable}_${id}`}
			name={variable}
			label={value}
			type={type}
			className={className}
			onChange={onChange}
			hasFeedback
			rules={
				className !== 'inputFactory_hidden__18I0s' && [
					{ required: true, message: 'Este campo é obrigatório.' },
				]
			}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<Input placeholder="" />
		</Form.Item>
	)
}

TextField.propTypes = {
	pageFieldsData: shape({
		value: string.isRequired,
		variable: string.isRequired,
		type: string.isRequired,
	}).isRequired,
	inputValue: string,
	className: object,
	onChange: func,
}

TextField.defaultProps = {
	inputValue: '',
	className: {},
	onChange: () => null,
}

export default TextField
