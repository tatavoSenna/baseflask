import React from 'react'
import { string, shape, object, func, number, bool } from 'prop-types'
import { Form, InputNumber } from 'antd'
import InfoField from '~/components/infoField'

const CurrencyField = ({
	pageFieldsData,
	className,
	onChange,
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
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<InputNumber
				min={0}
				placeholder=""
				step={0.1}
				decimalSeparator="."
				formatter={(value) =>
					` R$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
				}
				//formatter={(value) => ` R$${value}`}
				parser={(value) => value.replace(/[A-Z]|[a-z]|[$ ]|,/g, '')}
				precision={2}
				style={{ width: '100%', currency: 'BRL', style: 'currency' }}
				disabled={disabled}
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
	inputValue: number,
	disabled: bool,
}

CurrencyField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CurrencyField
