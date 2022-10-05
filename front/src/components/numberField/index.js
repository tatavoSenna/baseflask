import React from 'react'
import PropTypes, { string, shape, object, func, bool } from 'prop-types'
import { Form, InputNumber } from 'antd'
import InfoField from '~/components/infoField'
import { validateNumber } from 'utils'

const NumberField = ({
	pageFieldsData,
	inputValue,
	className,
	onChange,
	first,
	disabled,
	visible,
}) => {
	const {
		label,
		variable,
		type,
		id,
		info,
		list,
		min,
		max,
		decimals,
		step,
		optional,
	} = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={<InfoField label={label} info={info} />}
			type={type}
			className={className}
			hasFeedback
			rules={
				visible && [
					{
						required: !optional,
						message: 'Este campo é obrigatório.',
					},
				]
			}
			colon={false}
			initialValue={validateNumber(inputValue)}>
			<InputNumber
				autoFocus={first}
				placeholder=""
				min={validateNumber(min)}
				max={validateNumber(max)}
				precision={validateNumber(decimals)}
				step={validateNumber(step)}
				decimalSeparator=","
				disabled={disabled}
				onChange={onChange}
			/>
		</Form.Item>
	)
}

NumberField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		type: string.isRequired,
		info: string,
	}).isRequired,
	inputValue: string,
	className: string,
	onChange: func,
	first: bool,
	disabled: bool,
	visible: bool,
}

NumberField.defaultProps = {
	inputValue: '',
	className: '',
	onChange: () => null,
	visible: true,
}

export default NumberField
