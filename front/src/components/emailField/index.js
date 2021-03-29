import React from 'react'
import { string, shape, object, func, number } from 'prop-types'
import { Form, Input } from 'antd'

const EmailField = ({
	pageFieldsData,
	inputValue,
	className,
	onChange,
	first,
}) => {
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
					{ type, message: 'E-mail não é válido.' },
					{ required: true, message: 'Este campo é obrigatório.' },
				]
			}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<Input autoFocus={first} placeholder="" />
		</Form.Item>
	)
}

EmailField.propTypes = {
	pageFieldsData: shape({
		value: string.isRequired,
		variable: string.isRequired,
		type: string.isRequired,
	}).isRequired,
	inputValue: string,
	className: object,
	onChange: func,
	first: number,
}

EmailField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default EmailField
