import React from 'react'
import PropTypes, { string, shape, object, func, bool } from 'prop-types'
import { Form, InputNumber } from 'antd'
import InfoField from '~/components/infoField'

const PercentageField = ({
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
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<InputNumber
				autoFocus={first}
				placeholder=""
				min={min ? min : 0}
				max={max ? max : 100}
				precision={decimals ? decimals : undefined}
				step={step ? step : undefined}
				formatter={(value) => `${value}%`}
				parser={(value) => value.replace('%', '')}
				decimalSeparator=","
				disabled={disabled}
				onChange={onChange}
			/>
		</Form.Item>
	)
}

PercentageField.propTypes = {
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
	disabled: bool,
	visible: bool,
}

PercentageField.defaultProps = {
	inputValue: '',
	className: {},
	onChange: () => null,
	visible: true,
}

export default PercentageField
