import React from 'react'
import PropTypes, { string, shape, object, func, bool } from 'prop-types'
import { Form, InputNumber } from 'antd'
import InfoField from '~/components/infoField'

const NumberField = ({
	pageFieldsData,
	inputValue,
	className,
	onChange,
	first,
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
	} = pageFieldsData
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
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<InputNumber
				autoFocus={first}
				placeholder=""
				min={min ? min : undefined}
				max={max ? max : undefined}
				precision={decimals ? decimals : undefined}
				step={step ? step : undefined}
				decimalSeparator=","
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
	className: object,
	onChange: func,
	first: bool,
}

NumberField.defaultProps = {
	inputValue: '',
	className: {},
	onChange: () => null,
}

export default NumberField
