import React from 'react'
import { string, shape, object, func, number, bool } from 'prop-types'
import { Form, InputNumber } from 'antd'
import InfoField from '~/components/infoField'

const locale = 'pt-br'

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

	const currencyFormatter = (selectedCurrOpt) => (value) => {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency: selectedCurrOpt.split('::')[1],
		}).format(value)
	}

	const currencyParser = (val) => {
		try {
			// for when the input gets clears
			if (typeof val === 'string' && !val.length) {
				val = '0.0'
			}

			// detecting and parsing between comma and dot
			var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '')
			var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '')
			var reversedVal = val.replace(new RegExp('\\' + group, 'g'), '')
			reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.')
			//  => 1232.21 €

			// removing everything except the digits and dot
			reversedVal = reversedVal.replace(/[^0-9.]/g, '')
			//  => 1232.21

			// appending digits properly
			const digitsAfterDecimalCount = (reversedVal.split('.')[1] || []).length
			const needsDigitsAppended = digitsAfterDecimalCount > 2

			if (needsDigitsAppended) {
				reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2)
			}

			return Number.isNaN(reversedVal) ? 0 : reversedVal
		} catch (error) {
			console.error(error)
		}
	}

	const currency = 'BRAZIL::BRL'

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
				formatter={currencyFormatter(currency)}
				parser={currencyParser}
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
