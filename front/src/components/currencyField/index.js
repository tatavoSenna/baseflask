import React from 'react'
import { string, shape, object, func } from 'prop-types'
import { Form, InputNumber } from 'antd'

const CurrencyField = ({ pageFieldsData, className, onChange }) => {
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
							if (typeof value === 'number') {
								return Promise.resolve()
							}
							return Promise.reject('Valor não é válido.')
						},
					}),
				]
			}
			colon={false}>
			<InputNumber
				placeholder=""
				step={0.1}
				decimalSeparator=","
				precision={2}
				style={{ width: '100%' }}
			/>
		</Form.Item>
	)
}

CurrencyField.propTypes = {
	pageFieldsData: shape({
		value: string.isRequired,
		variable: string.isRequired,
		type: string.isRequired,
	}).isRequired,
	className: object,
	onChange: func,
}

CurrencyField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CurrencyField
