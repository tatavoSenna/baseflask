import React from 'react'
import PropTypes, { string, shape, object, func, bool } from 'prop-types'
import { Form, DatePicker } from 'antd'
import InfoField from '~/components/infoField'
import { validateDate } from 'utils'

const DateField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	disabled,
}) => {
	const { label, variable, type, id, info, list, optional } = pageFieldsData
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
			hasFeedback
			rules={
				!hidden && [
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}
			initialValue={validateDate(inputValue)}
			colon={false}>
			<DatePicker
				format="DD-MM-YYYY"
				placeholder={''}
				disabled={disabled}
				onChange={onChange}
			/>
		</Form.Item>
	)
}

DateField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([object, string]).isRequired,
		info: string,
	}).isRequired,
	className: PropTypes.string,
	onChange: func,
	inputValue: string,
	disabled: bool,
}

export default DateField
