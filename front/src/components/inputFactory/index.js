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
import PercentageField from '~/components/percentageField'
import BankField from '~/components/bankField'
import FileField from '~/components/fileField'
import TimeField from '~/components/timeField'
import TextAreaField from '~/components/textAreaField'
import ImageField from '~/components/imageField'
import PersonField from '~/components/personField'
import StructuredList from '~/components/structuredList'
import StructuredCheckbox from '~/components/structuredCheckbox'

import { Divider } from 'antd'
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
	form,
}) {
	const state = useHistory().location.state
	let values = { current: 0 }
	if (state && state.values) {
		values = state.values
	}
	const currentPage = values.current
	const dispatch = useDispatch()
	const children = []

	function checkField(input, i) {
		const compareCondition = (condition, input) => {
			const { operator, value } = condition

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

			return comparison
		}

		let comparison
		let variableName

		// This 'if' is here so templates whose variables are not objects still work
		if (typeof pageFieldsData[i].variable === 'string') {
			variableName = pageFieldsData[i].variable
		} else {
			variableName = pageFieldsData[i].variable.name
		}

		pageFieldsData.forEach((field, fieldIndex) => {
			if (Array.isArray(field.condition)) {
				comparison = Array(field.condition.length).fill(false)
				field.condition.forEach((condition, index) => {
					let value
					if (condition.variable === variableName) {
						value = input
					} else {
						value = form.getFieldValue(condition.variable)
					}
					comparison[index] = compareCondition(condition, value)
				})
				if (comparison.every((i) => i === true)) {
					dispatch(updateVisible({ value: true, pageIndex, fieldIndex }))
				} else {
					dispatch(updateVisible({ value: false, pageIndex, fieldIndex }))
				}
			} else if (field.condition && field.condition.variable === variableName) {
				comparison = compareCondition(field.condition, input)
				if (comparison) {
					dispatch(updateVisible({ value: true, pageIndex, fieldIndex }))
				} else {
					dispatch(updateVisible({ value: false, pageIndex, fieldIndex }))
				}
			}
		})
	}

	for (let i = 0; i < pageFieldsData.length; i++) {
		const { type, conditional, initialValue } = pageFieldsData[i]
		const first = i === 0

		switch (type) {
			case 'radio':
				children.push(
					<RadioField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
						disabled={disabled}
						onChange={conditional ? (e) => checkField(e, i) : undefined}
					/>
				)
				break
			case 'date':
				children.push(
					<DateField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
						disabled={disabled}
						onChange={
							conditional ? (e) => checkField(e.target.value, i) : undefined
						}
					/>
				)
				break
			case 'percentage':
				children.push(
					<PercentageField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
						inputValue={initialValues ? initialValues[i] : initialValue}
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
			case 'separator':
				children.push(
					<Divider style={visible[i] ? {} : { display: 'none' }}>
						{pageFieldsData[i].title}
					</Divider>
				)
				break
			default:
				children.push(
					<TextField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={visible[i] ? undefined : styles.hidden}
						inputValue={initialValues ? initialValues[i] : initialValue}
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
