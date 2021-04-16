import React, { useState } from 'react'
import { array } from 'prop-types'
import RadioField from '~/components/radioField'
import CnpjField from '~/components/cnpjField'
import CpfField from '~/components/cpfField'
import EmailField from '~/components/emailField'
import CurrencyField from '~/components/currencyField'
import TextField from '~/components/textField'
import DropdownField from '~/components/dropdownField'
import DateField from '~/components/dateField'
import StateField from '~/components/stateField'
import CnaeField from '~/components/cnaeField'
import CityField from '~/components/cityField'
import CheckboxField from '~/components/checkboxField'
import SliderField from '~/components/sliderField'
import BankField from '~/components/bankField'
import FileField from '~/components/fileField'
import TimeField from '~/components/timeField'
import TextAreaField from '~/components/textAreaField'

import styles from './index.module.scss'

function InputFactory({ data: pageFieldsData }) {
	const children = []
	const hiddenInputList = []

	pageFieldsData.map((field) => {
		return hiddenInputList.push(!!field.condition)
	})
	const [hiddenInput, setHiddenInput] = useState([hiddenInputList])

	function checkField(input, i) {
		const targetIndex = pageFieldsData.findIndex((field) => {
			// This 'if' is here so templates whose variables are not objects still work
			if (typeof field === 'string') {
				return field.variable === pageFieldsData[i].conditional
			} else {
				return field.variable.name === pageFieldsData[i].conditional
			}
		})
		const { operator, value } = pageFieldsData[targetIndex].condition
		let comparison

		switch (operator) {
			case '>':
				comparison = input > value
				break
			case '>=':
				comparison = input >= value
				break
			case '<':
				comparison = input < value
				break
			case '<=':
				comparison = input <= value
				break
			case '=':
				comparison = input === value
				break
			default:
				break
		}

		if (comparison) {
			const tmpHiddenList = []
			hiddenInput[0].map((item, index) => {
				if (index === targetIndex) {
					tmpHiddenList.push(false)
				} else {
					tmpHiddenList.push(item)
				}
				return tmpHiddenList
			})
			setHiddenInput([tmpHiddenList])
		} else {
			const tmpHiddenList = []
			hiddenInput[0].map((item, index) => {
				if (index === targetIndex) {
					tmpHiddenList.push(true)
				} else {
					tmpHiddenList.push(item)
				}
				return tmpHiddenList
			})
			setHiddenInput([tmpHiddenList])
		}
	}

	for (let i = 0; i < pageFieldsData.length; i++) {
		const { type, conditional } = pageFieldsData[i]
		const isConditional = !!conditional
		const first = i === 0

		switch (type) {
			case 'radio':
				children.push(
					<RadioField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.value, i) : undefined
						}
					/>
				)
				break
			case 'cnpj':
				children.push(
					<CnpjField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.value, i) : undefined
						}
						first={first}
					/>
				)
				break
			case 'cpf':
				children.push(
					<CpfField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.value, i) : undefined
						}
						first={first}
					/>
				)
				break
			case 'email':
				children.push(
					<EmailField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.value, i) : undefined
						}
						first={first}
					/>
				)
				break
			case 'currency':
				children.push(
					<CurrencyField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.value, i) : undefined
						}
					/>
				)
				break
			case 'dropdown':
				children.push(
					<DropdownField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'date':
				children.push(
					<DateField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'time':
				children.push(
					<TimeField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'state':
				children.push(
					<StateField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'checkbox':
				children.push(
					<CheckboxField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'cnae':
				children.push(
					<CnaeField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'city':
				children.push(
					<CityField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'slider':
				children.push(
					<SliderField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'bank':
				children.push(
					<BankField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break

			case 'variable_file':
				children.push(
					<FileField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
					/>
				)
				break
			case 'text_area':
				children.push(
					<TextAreaField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
					/>
				)
				break
			default:
				children.push(
					<TextField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.value, i) : undefined
						}
						first={first}
					/>
				)
		}
	}
	return children
}

InputFactory.propTypes = {
	data: array.isRequired,
}

export default InputFactory
