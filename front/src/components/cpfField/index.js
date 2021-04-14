import React from 'react'
import { string, shape, object, func, boolean } from 'prop-types'
import { Form } from 'antd'
import { validateCPF } from '../../utils'
import MaskedInput from 'antd-mask-input'

const CpfField = ({ pageFieldsData, className, onChange, first }) => {
	const { label, variable, type, id } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={label}
			type={type}
			className={className}
			onChange={onChange}
			hasFeedback
			rules={
				className !== 'inputFactory_hidden__18I0s' && [
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
			colon={false}>
			<MaskedInput autoFocus={first} mask="111.111.111-11" placeholder="" />
		</Form.Item>
	)
}

CpfField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: string.isRequired,
		type: string.isRequired,
	}).isRequired,
	className: object,
	onChange: func,
	first: boolean,
}

CpfField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CpfField
