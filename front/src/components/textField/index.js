import React from 'react'
import { string, shape, object, func, boolean } from 'prop-types'
import { Form, Input } from 'antd'

const TextField = ({
	pageFieldsData,
	inputValue,
	className,
	onChange,
	first,
}) => {
	const { label, variable, type, id } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={label}
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
			<Input autoFocus={first} placeholder="" />
		</Form.Item>
	)
}

TextField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: string.isRequired,
		type: string.isRequired,
	}).isRequired,
	inputValue: string,
	className: object,
	onChange: func,
	first: boolean,
}

TextField.defaultProps = {
	inputValue: '',
	className: {},
	onChange: () => null,
}

export default TextField
