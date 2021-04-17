import React from 'react'
import { string, shape, object, func } from 'prop-types'
import { Form, InputNumber } from 'antd'

const CurrencyField = ({ pageFieldsData, className, onChange }) => {
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
				typeof className === 'string' &&
				className.slice(0, 19) !== 'inputFactory_hidden' && [
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
				min={0}
				placeholder=""
				step={0.1}
				decimalSeparator=","
				formatter={(value) => `R$ ${value}`}
				parser={(value) => value.replace(/[A-Z]|[a-z]|[$ ]|,+/g, '')}
				precision={2}
				style={{ width: '100%' }}
			/>
		</Form.Item>
	)
}

CurrencyField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
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
