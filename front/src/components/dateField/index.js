import React from 'react'
import { string, shape, object, func } from 'prop-types'
import { Form, DatePicker } from 'antd'

const DateField = ({ pageFieldsData, className, onChange }) => {
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
				typeof className === 'string' &&
				className.slice(0, 19) !== 'inputFactory_hidden' && [
					{ required: true, message: 'Este campo é obrigatório.' },
				]
			}
			colon={false}>
			<DatePicker format={'DD-MM-YYYY'} placeholder={''} />
		</Form.Item>
	)
}

DateField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
	}).isRequired,
	className: object,
	onChange: func,
}

export default DateField
