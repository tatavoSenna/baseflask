import React from 'react'
import PropTypes, { string, shape, func, bool, object } from 'prop-types'
import { Form, Input } from 'antd'
import InfoField from '~/components/infoField'

const TextField = ({
	pageFieldsData,
	inputValue,
	className,
	onChange,
	first,
	disabled,
	visible,
	OutsideLabel,
}) => {
	const { label, variable, type, id, info, list, placeholder, optional } =
		pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const returnLabel = () => {
		if (label.length > 0) {
			return <InfoField label={label} info={info} />
		} else if (OutsideLabel.length > 0) {
			return <InfoField label={OutsideLabel} info={info} />
		}
		return null
	}

	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={returnLabel()}
			type={type}
			className={className}
			onChange={onChange ? (e) => onChange(e.target.value) : undefined}
			hasFeedback
			rules={
				visible && [
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<Input autoFocus={first} placeholder={placeholder} disabled={disabled} />
		</Form.Item>
	)
}

TextField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([object, string]),
		type: string.isRequired,
		info: string,
	}).isRequired,
	inputValue: string,
	className: string,
	onChange: func,
	first: bool,
	disabled: bool,
	visible: bool,
	typeOfText: string,
	OutsideLabel: string,
}

TextField.defaultProps = {
	inputValue: '',
	onChange: () => null,
	OutsideLabel: '',
	visible: true,
}

export default TextField
