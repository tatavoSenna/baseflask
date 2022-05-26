import React from 'react'
import { string, shape, object, func, number, bool } from 'prop-types'
import { Form, InputNumber } from 'antd'
import InfoField from '~/components/infoField'
import { currencyFormatter, currencyParser } from './currencyUtils'

const CurrencyField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	disabled,
	visible,
}) => {
	const { label, variable, type, id, info, list, optional } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const locale = 'pt-br'
	const currency = 'BRAZIL::BRL'

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
								if (typeof value === 'number') return Promise.resolve()
								else return Promise.reject('Valor não é válido.')
							}
						},
					}),
				]
			}
			colon={false}
			initialValue={!inputValue ? '' : Number(inputValue)}>
			<InputNumber
				min={0}
				placeholder=""
				formatter={currencyFormatter(currency, locale)}
				parser={currencyParser(locale)}
				style={{ width: '100%', currency: 'BRL', style: 'currency' }}
				disabled={disabled}
				onChange={onChange}
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
	visible: bool,
}

CurrencyField.defaultProps = {
	className: {},
	onChange: () => null,
	visible: true,
}

export default CurrencyField
