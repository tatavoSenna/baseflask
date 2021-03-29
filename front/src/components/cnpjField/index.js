import React from 'react'
import { string, shape, object, func, number } from 'prop-types'
import { Form } from 'antd'
import { validateCNPJ } from '../../utils'
import MaskedInput from 'antd-mask-input'

const CnpjField = ({ pageFieldsData, className, onChange, first }) => {
	const { value, variable, type, id } = pageFieldsData
	return (
		<Form.Item
			key={`${variable}_${id}`}
			name={variable}
			label={value}
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
							if (validateCNPJ(value)) {
								return Promise.resolve()
							}
							return Promise.reject('CNPJ não é válido.')
						},
					}),
				]
			}
			colon={false}>
			<MaskedInput autoFocus={first} mask="11.111.111/1111-11" placeholder="" />
		</Form.Item>
	)
}

CnpjField.propTypes = {
	pageFieldsData: shape({
		value: string.isRequired,
		variable: string.isRequired,
		type: string.isRequired,
	}).isRequired,
	className: object,
	onChange: func,
	first: number,
}

CnpjField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CnpjField
