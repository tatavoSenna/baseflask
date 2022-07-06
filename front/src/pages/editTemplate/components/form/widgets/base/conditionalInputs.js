import React, { useState } from 'react'

import { array, func, number, object, oneOfType, string } from 'prop-types'
import { InputNumber, Select } from 'antd'
import {
	currencyFormatter,
	currencyParser,
} from 'components/currencyField/currencyUtils'

export const TextInput = ({ changeCallback, defaultValue, ...props }) => {
	const [options, setOptions] = useState([])
	return (
		<Select
			{...props}
			defaultValue={defaultValue !== '' ? defaultValue : undefined}
			mode="multiple"
			size="default"
			options={options}
			filterOption={false}
			onSearch={(s) => setOptions([{ label: s, value: s }])}
			onChange={(v) => {
				setOptions([])

				switch (v.length) {
					case 0:
						changeCallback('')
						break
					case 1:
						changeCallback(v[0])
						break
					default:
						changeCallback(v)
				}
			}}
			notFoundContent={null}
		/>
	)
}

export const NumberInput = ({ changeCallback, ...props }) => (
	<InputNumber
		{...props}
		onBlur={(e) => changeCallback(Number(e.target.value))}
	/>
)

export const CurrencyInput = ({ defaultValue, changeCallback, style = {} }) => {
	const parser = currencyParser()

	return (
		<InputNumber
			min={0}
			placeholder=""
			formatter={currencyFormatter()}
			parser={parser}
			style={{ width: '100%', currency: 'BRL', style: 'currency', ...style }}
			onBlur={(e) => changeCallback(Number(parser(e.target.value)))}
			defaultValue={defaultValue}
			autoComplete="off"
		/>
	)
}

export const ListInput = ({ changeCallback, defaultValue, ...props }) => {
	const [options, setOptions] = useState([])
	return (
		<Select
			{...props}
			defaultValue={defaultValue !== '' ? defaultValue : undefined}
			mode="multiple"
			size="default"
			options={options}
			filterOption={false}
			onSearch={(s) => setOptions([{ label: s, value: s }])}
			onChange={(v) => {
				setOptions([])
				changeCallback(v)
			}}
			notFoundContent={null}
		/>
	)
}

export const conditionalInputs = {
	string: TextInput,
	number: NumberInput,
	currency: CurrencyInput,
	list: ListInput,
}

TextInput.propTypes = {
	changeCallback: func,
	defaultValue: oneOfType([array, string]),
}

NumberInput.propTypes = {
	changeCallback: func,
}

CurrencyInput.propTypes = {
	defaultValue: number,
	changeCallback: func,
	style: object,
}

ListInput.propTypes = {
	changeCallback: func,
	defaultValue: oneOfType([array, string]),
}
