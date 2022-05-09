import { Form } from 'antd'
import { string, shape, object, func, bool } from 'prop-types'
import { MaskedInput } from 'antd-mask-input'
import InfoField from 'components/infoField'
import React from 'react'
import { validateOptionalCep } from 'utils'

const CepField = ({
	pageFieldsData,
	className,
	onChange,
	first,
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
					() => ({
						validator(rule, value) {
							if (!validateOptionalCep(value, optional)) {
								return Promise.reject('Cep inválido')
							}
							if (!optional) {
								if (!value) {
									return Promise.reject('Este campo é obrigatório')
								}
								if (!validateOptionalCep(value, optional)) {
									return Promise.reject('Cep inválido')
								}
							}
							return Promise.resolve()
						},
					}),
				]
			}
			colon={false}
			initialValue={inputValue}>
			<MaskedInput
				onChange={onChange ? (e) => onChange(e.target.value) : undefined}
				autoFocus={first}
				mask="11111-111"
				placeholder=""
				disabled={disabled}
			/>
		</Form.Item>
	)
}

CepField.propTypes = {
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

CepField.defaultProps = {
	onChange: () => null,
}

export default CepField
