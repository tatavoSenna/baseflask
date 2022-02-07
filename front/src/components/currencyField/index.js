import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { string, shape, object, func, number, bool } from 'prop-types'
import { Form, Input } from 'antd'
import InfoField from '~/components/infoField'
import formatCurrency from './formatCurrency'

const defaultConfig = {
	locale: 'pt-BR',
	formats: {
		number: {
			BRL: {
				style: 'currency',
				currency: 'BRL',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			},
		},
	},
}

const CurrencyField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	disabled,
	config,
	currency,
	max,
	autoFocus,
	autoSelect,
	autoReset,
	onChangeCurrency,
	onBlur,
	onFocus,
	onKeyPress,
	value,
	defaultValue,
}) => {
	const { label, variable, type, id, info, list } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname
	const hidden =
		typeof className === 'string'
			? className.slice(0, 19) === 'inputFactory_hidden'
			: false

	const inputRef = useCallback(
		(node) => {
			const isActive = node === document.activeElement

			if (node && autoFocus && !isActive) {
				node.focus()
			}
		},
		[autoFocus]
	)

	const [maskedValue, setMaskedValue] = useState('0')

	// to prevent a malformed config object
	const safeConfig = useMemo(
		() => () => {
			const {
				formats: {
					number: {
						[currency]: { maximumFractionDigits },
					},
				},
			} = config

			const finalConfig = {
				...defaultConfig,
				...config,
			}

			// at the moment this prevents problems when converting numbers
			// with zeroes in-between, otherwise 205 would convert to 25.
			finalConfig.formats.number[
				currency
			].minimumFractionDigits = maximumFractionDigits

			return finalConfig
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[currency, config]
	)

	const clean = (number) => {
		if (typeof number === 'number') {
			return number
		}

		// strips everything that is not a number (positive or negative)
		return Number(number.toString().replace(/[^0-9-]/g, ''))
	}

	const normalizeValue = (number) => {
		const {
			formats: {
				number: {
					[currency]: { maximumFractionDigits },
				},
			},
		} = safeConfig()
		let safeNumber = number

		if (typeof number === 'string') {
			safeNumber = clean(number)

			if (safeNumber % 1 !== 0) {
				safeNumber = safeNumber.toFixed(maximumFractionDigits)
			}
		} else {
			// all input numbers must be a float point (for the cents portion). This is a fallback in case of integer ones.
			safeNumber = Number.isInteger(number)
				? Number(number) * 10 ** maximumFractionDigits
				: number.toFixed(maximumFractionDigits)
		}

		// divide it by 10 power the maximum fraction digits.
		return clean(safeNumber) / 10 ** maximumFractionDigits
	}

	const calculateValues = (inputFieldValue) => {
		const value = normalizeValue(inputFieldValue)
		const maskedValue = formatCurrency(value, safeConfig(), currency)

		return [value, maskedValue]
	}

	const updateValues = (value) => {
		const [calculatedValue, calculatedMaskedValue] = calculateValues(value)

		if (!max || calculatedValue <= max) {
			setMaskedValue(calculatedMaskedValue)

			return [calculatedValue, calculatedMaskedValue]
		} else {
			return [normalizeValue(maskedValue), maskedValue]
		}
	}

	const handleChange = (event) => {
		event.preventDefault()

		const [value, maskedValue] = updateValues(event.target.value)

		if (maskedValue) {
			onChangeCurrency(event, value, maskedValue)
		}
	}

	const handleBlur = (event) => {
		const [value, maskedValue] = updateValues(event.target.value)

		if (autoReset) {
			calculateValues(0)
		}

		if (maskedValue) {
			onBlur(event, value, maskedValue)
		}
	}

	const handleFocus = (event) => {
		if (autoSelect) {
			event.target.select()
		}

		const [value, maskedValue] = updateValues(event.target.value)

		if (maskedValue) {
			onFocus(event, value, maskedValue)
		}
	}

	const handleKeyUp = (event) => onKeyPress(event, event.key, event.keyCode)

	useEffect(() => {
		const currentValue = value || defaultValue || 0
		const [, maskedValue] = calculateValues(currentValue)

		setMaskedValue(maskedValue)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currency, value, defaultValue, config])

	return (
		<Form.Item
			key={name}
			// name={list !== undefined ? [list, name] : name}
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
			initialValue={!inputValue ? '' : Number(inputValue)}>
			<Input
				ref={inputRef}
				value={maskedValue}
				onChange={handleChange}
				onBlur={handleBlur}
				onFocus={handleFocus}
				onKeyUp={handleKeyUp}
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
	defaultValue: number,
	value: number,
	max: number,
	currency: string.isRequired,
	config: shape().isRequired,
	autoFocus: bool.isRequired,
	autoSelect: bool.isRequired,
	autoReset: bool.isRequired,
	onChangeCurrency: func.isRequired,
	onBlur: func.isRequired,
	onFocus: func.isRequired,
	onKeyPress: func.isRequired,
}

CurrencyField.defaultProps = {
	className: {},
	currency: 'BRL',
	value: 0,
	config: defaultConfig,
	autoFocus: false,
	autoSelect: false,
	autoReset: false,
	onChangeCurrency: (f) => f,
	onBlur: (f) => f,
	onFocus: (f) => f,
	onKeyPress: (f) => f,
}

export default CurrencyField
