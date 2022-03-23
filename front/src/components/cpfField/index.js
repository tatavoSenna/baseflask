import React from 'react'
import { string, shape, object, func, bool } from 'prop-types'
import { Form } from 'antd'
import { validateCPF } from '../../utils'
import MaskedInput from 'antd-mask-input'
import InfoField from '~/components/infoField'

const CpfField = ({
	pageFieldsData,
	className,
	onChange,
	first,
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
			hasFeedback
			rules={
				!hidden && [
					() => ({
						validator(rule, value) {
							if (!value) {
								return Promise.reject('Este campo é obrigatório.')
							}
							if (validateCPF(value)) {
								return Promise.resolve()
							}
							return Promise.reject('CPF não é válido.')
						},
					}),
				]
			}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}
		>
			<MaskedInput
				onChange={onChange}
				autoFocus={first}
				mask="111.111.111-11"
				placeholder=""
				disabled={disabled}
			/>
		</Form.Item>
	)
}

CpfField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	className: string,
	onChange: func,
	first: bool,
	inputValue: string,
	disabled: bool,
}

CpfField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CpfField
