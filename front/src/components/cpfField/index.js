import React from 'react'
import { string, shape } from 'prop-types'
import { Form } from 'antd'
import { validateCPF } from '../../utils'
import MaskedInput from 'antd-mask-input'

const CpfField = ({ pageFieldsData }) => {
	const { value, variable, type, id } = pageFieldsData
	return (
		<Form.Item
			key={`${variable}_${id}`}
			name={variable}
			label={value}
			type={type}
			hasFeedback
			rules={[
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
			]}
			colon={false}>
			<MaskedInput mask="111.111.111-11" placeholder="" />
		</Form.Item>
	)
}

CpfField.propTypes = {
	pageFieldsData: shape({
		value: string.isRequired,
		variable: string.isRequired,
		type: string.isRequired,
	}).isRequired,
}

export default CpfField
