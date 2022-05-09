import React from 'react'
import PropTypes, { string, shape, func, bool } from 'prop-types'
import { Form, Input } from 'antd'
import InfoField from '~/components/infoField'

const EmailField = ({
	pageFieldsData,
	inputValue,
	className,
	onChange,
	first,
	disabled,
	placeHolderRequirement,
	OutsideLabel,
}) => {
	const { label, variable, type, id, info, list, optional } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname
	const hidden =
		typeof className === 'string'
			? className.slice(0, 19) === 'inputFactory_hidden'
			: false

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
			hasFeedback
			rules={
				!hidden && [
					{ type, message: 'E-mail não é válido.' },
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<Input
				onChange={onChange ? (e) => onChange(e.target.value) : undefined}
				autoFocus={first}
				placeholder={placeHolderRequirement}
				disabled={disabled}
			/>
		</Form.Item>
	)
}

EmailField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
			.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	inputValue: string,
	className: string,
	onChange: func,
	first: bool,
	disabled: bool,
	OutsideLabel: string,
	placeHolderRequirement: string,
}

EmailField.defaultProps = {
	onChange: () => null,
	placeHolderRequirement: '',
	OutsideLabel: '',
}

export default EmailField
