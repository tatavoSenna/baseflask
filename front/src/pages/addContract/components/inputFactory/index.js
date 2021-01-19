import React, { useState } from 'react'
import { array } from 'prop-types'
import RadioField from '../../../../components/radioField'
import CnpjField from '../../../../components/cnpjField'
import CpfField from '../../../../components/cpfField'
import EmailField from '../../../../components/emailField'
import CurrencyField from '../../../../components/currencyField'
import TextField from '../../../../components/textField'
import DropdownField from '../../../../components/dropdownField'
import DateField from '../../../../components/dateField'

import styles from './index.module.scss'

function InputFactory({ data: pageFieldsData }) {
	const children = []
	const hiddenInputList = []

	pageFieldsData.map((field) => {
		return hiddenInputList.push(!!field.condition)
	})
	const [hiddenInput, setHiddenInput] = useState([hiddenInputList])

	function checkField(input, i) {
		const targetIndex = pageFieldsData.findIndex(
			(field) => field.variable === pageFieldsData[i].conditional
		)
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

	// function renderFields(children) {
	for (let i = 0; i < pageFieldsData.length; i++) {
		const { type, conditional } = pageFieldsData[i]
		const isConditional = !!conditional

		// objectLiterals[type]()
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
			default:
				children.push(
					<TextField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={hiddenInput[0][i] ? styles.hidden : undefined}
						onChange={
							isConditional ? (e) => checkField(e.target.value, i) : undefined
						}
					/>
				)
		}
	}
	// }

	return children
}

InputFactory.propTypes = {
	data: array.isRequired,
}

export default InputFactory
