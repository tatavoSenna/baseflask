import React from 'react'
import { array, number } from 'prop-types'
import { useHistory } from 'react-router-dom'

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
import NumberField from '~/components/numberField'
import BankField from '~/components/bankField'
import FileField from '~/components/fileField'
import TimeField from '~/components/timeField'
import TextAreaField from '~/components/textAreaField'
import ImageField from '~/components/imageField'
import PersonField from '~/components/personField'
import StructuredList from '~/components/structuredList'
import StructuredCheckbox from '~/components/structuredCheckbox'

import { useDispatch } from 'react-redux'
import { updateVisible } from '~/states/modules/question'

import styles from './index.module.scss'
import './styles.css'

function InputFactory({
	data: pageFieldsData,
	visible,
	pageIndex,
	disabled,
	initialValues,
}) {
	const { values } = useHistory().location.state
	const currentPage = values !== undefined ? parseInt(values.current) : 0
	const dispatch = useDispatch()
	const children = []

	function checkField(input, i) {
		// This 'if' is here so templates whose variables are not objects still work
		let changedName
		if (typeof pageFieldsData[i].variable === 'string') {
			changedName = pageFieldsData[i].variable
		} else {
			changedName = pageFieldsData[i].variable.name
		}

		pageFieldsData.forEach((field, fieldIndex) => {
			if (field.condition && field.condition.variable === changedName) {
				const { operator, value } = field.condition

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
						// If value is an array, OR logic is applied
						if (typeof value === 'object') {
							value.forEach((item) => {
								if (input === item) {
									comparison = true
								}
							})
						} else {
							comparison = input === value
						}
						break
					default:
						comparison = false
						break
				}

				if (comparison) {
					dispatch(updateVisible({ value: true, pageIndex, fieldIndex }))
				} else {
					dispatch(updateVisible({ value: false, pageIndex, fieldIndex }))
				}
			}
		})
	}

	for (let i = 0; i < pageFieldsData.length; i++) {
		const { type, conditional } = pageFieldsData[i]
		const first = i === 0

		switch (type) {
			case 'radio':
				children.push(
					<RadioField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.value, i) : undefined
						}
					/>
				)
				break
			case 'cnpj':
				children.push(
					<CnpjField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.value, i) : undefined
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
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.value, i) : undefined
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
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.value, i) : undefined
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
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.value, i) : undefined
						}
					/>
				)
				break
			case 'dropdown':
				children.push(
					<DropdownField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'date':
				children.push(
					<DateField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'time':
				children.push(
					<TimeField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'state':
				children.push(
					<StateField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'checkbox':
				children.push(
					<CheckboxField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'cnae':
				children.push(
					<CnaeField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'city':
				children.push(
					<CityField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'slider':
				children.push(
					<SliderField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break
			case 'number':
				children.push(
					<NumberField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.value, i) : undefined
						}
					/>
				)
				break
			case 'bank':
				children.push(
					<BankField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.checked, i) : undefined
						}
					/>
				)
				break

			case 'variable_file':
				children.push(
					<FileField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
					/>
				)
				break
			case 'text_area':
				children.push(
					<TextAreaField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.value, i) : undefined
						}
					/>
				)
				break
			case 'variable_image':
				children.push(
					<ImageField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
					/>
				)
				break
			case 'person':
				children.push(
					<PersonField
						key={i}
						pageIndex={currentPage}
						fieldIndex={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
					/>
				)
				break
			case 'structured_list':
				children.push(
					<StructuredList
						key={i}
						pageIndex={currentPage}
						fieldIndex={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
					/>
				)
				break
			case 'structured_checkbox':
				children.push(
					<StructuredCheckbox
						key={i}
						pageIndex={currentPage}
						fieldIndex={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						onChange={
							conditional ? (e) => checkField(e.target.value, i) : undefined
						}
					/>
				)
				break
			default:
				children.push(
					<TextField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : ''}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.value, i) : undefined
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
	visible: array,
	pageIndex: number,
}

export default InputFactory
