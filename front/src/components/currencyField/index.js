import React from 'react'
import { string, shape, object, func, number } from 'prop-types'
import { Form, InputNumber } from 'antd'
import InfoField from '~/components/infoField'

const CurrencyField = ({ pageFieldsData, className, onChange, listIndex }) => {
	const { label, variable, type, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	const name = isObj ? variable.name : variable
	const hidden =
		typeof className === 'string'
			? className.slice(0, 19) === 'inputFactory_hidden'
			: false
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={listIndex !== undefined ? [listIndex, name] : name}
			label={<InfoField label={label} info={info} />}
			type={type}
			className={className}
			onChange={onChange}
			hasFeedback
			rules={
				!hidden && [
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
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
	listIndex: number,
}

CurrencyField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CurrencyField
