import React from 'react'
import { string, shape, object, func, bool } from 'prop-types'
import { Form } from 'antd'
import { validateCNPJ } from '../../utils'
import MaskedInput from 'antd-mask-input'
import InfoField from '~/components/infoField'

const CnpjField = ({
	pageFieldsData,
	className,
	onChange,
	first,
	inputValue,
	disabled,
	visible,
}) => {
	const { label, variable, type, id, info, list, optional } = pageFieldsData
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
					() => ({
						validator(rule, value) {
							if (!value) {
								if (optional) return Promise.resolve()
								else return Promise.reject('Este campo é obrigatório.')
							} else {
								if (validateCNPJ(value)) return Promise.resolve()
								else return Promise.reject('CNPJ não é válido.')
							}
						},
					}),
				]
			}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<MaskedInput
				onChange={onChange ? (e) => onChange(e.target.value) : undefined}
				autoFocus={first}
				mask="11.111.111/1111-11"
				placeholder=""
				disabled={disabled}
			/>
		</Form.Item>
	)
}

CnpjField.propTypes = {
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
	visible: bool,
}

CnpjField.defaultProps = {
	className: {},
	onChange: () => null,
	visible: true,
}

export default CnpjField
