import React from 'react'
import { string, shape, object, func, bool } from 'prop-types'
import { Form, DatePicker } from 'antd'
import InfoField from '~/components/infoField'
import moment from 'moment'

const DateField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	disabled,
}) => {
	const { label, variable, type, id, info, list } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname
	const hidden =
		typeof className === 'string'
			? className.slice(0, 19) === 'inputFactory_hidden'
			: false
	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={<InfoField label={label} info={info} />}
			type={type}
			className={className}
			onChange={onChange}
			hasFeedback
			rules={
				!hidden && [{ required: true, message: 'Este campo é obrigatório.' }]
			}
			initialValue={inputValue !== '' ? moment(inputValue) : ''}
			colon={false}>
			<DatePicker format={'DD-MM-YYYY'} placeholder={''} disabled={disabled} />
		</Form.Item>
	)
}

DateField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
	inputValue: string,
	disabled: bool,
}

export default DateField
