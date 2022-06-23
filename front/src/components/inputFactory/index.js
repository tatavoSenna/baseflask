import React, { useEffect } from 'react'
import { array, number } from 'prop-types'

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
import NumberField from '~/components/numberField'
import PercentageField from '~/components/percentageField'
import BankField from '~/components/bankField'
import TimeField from '~/components/timeField'
import TextAreaField from '~/components/textAreaField'
import ImageField from '~/components/imageField'
import PersonField from '~/components/personField'
import StructuredList from '~/components/structuredList'
import StructuredCheckbox from '~/components/structuredCheckbox'
import AddressField from '~/components/addressField'
import DatabaseField from 'components/databaseField'

import { Divider } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { updateVisible } from '~/states/modules/question'

import styles from './index.module.scss'
import './styles.css'

function InputFactory({
	data: pageFieldsData,
	visible,
	disabled,
	initialValues,
	form,
	currentFormStep,
}) {
	const dispatch = useDispatch()
	const children = []

	// Call updateVisible after first render, so the default values are considered for visibility

	useEffect(() => {
		if (typeof form !== 'undefined') {
			dispatch(
				updateVisible({
					form,
				})
			)
		}
	}, [dispatch, form, currentFormStep])

	const conditionals = useSelector(({ question }) => question.conditionals)

	for (let i = 0; i < pageFieldsData.length; i++) {
		const { type, initialValue, variable } = pageFieldsData[i]
		const isVisible = visible[i] ? styles['default-style'] : styles.hidden
		const key = currentFormStep + '_' + i

		let isConditional, subConditions
		if (variable?.name !== undefined) {
			const conditions = conditionals
				.map((c) => c.split('.'))
				.filter((c) => c[0] === variable.name)

			isConditional = conditions.length > 0
			subConditions = new Set(conditions.map((c) => c[1]).filter((c) => c))
		}

		const defaultValue = () => {
			if (initialValues) {
				if (variable.hasOwnProperty('name')) {
					return initialValues[variable.name]
						? initialValues[variable.name]
						: initialValue
				} else {
					return initialValues[variable]
						? initialValues[variable]
						: initialValue
				}
			}
			return initialValue
		}
		const first = i === 0

		let onchange = (selector = (e) => e) =>
			isConditional
				? (e, subfield) => {
						if (subfield === undefined || subConditions.has(subfield))
							dispatch(
								updateVisible({
									input: selector(e),
									form,
									fieldIndex: i,
									pageIndex: currentFormStep,
									subfield,
								})
							)
				  }
				: () => {}

		switch (type) {
			case 'radio':
				children.push(
					<RadioField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						form={form}
						onChange={onchange((e) => e.target.value)}
						first={first}
					/>
				)
				break
			case 'cnpj':
				children.push(
					<CnpjField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'cpf':
				children.push(
					<CpfField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'email':
				children.push(
					<EmailField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'currency':
				children.push(
					<CurrencyField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'dropdown':
				children.push(
					<DropdownField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						form={form}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'date':
				children.push(
					<DateField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'time':
				children.push(
					<TimeField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange((e) => e.target.value)}
						first={first}
					/>
				)
				break
			case 'state':
				children.push(
					<StateField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'checkbox':
				children.push(
					<CheckboxField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'cnae':
				children.push(
					<CnaeField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'city':
				children.push(
					<CityField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'number':
				children.push(
					<NumberField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'percentage':
				children.push(
					<PercentageField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'bank':
				children.push(
					<BankField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break

			case 'text_area':
				children.push(
					<TextAreaField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'variable_image':
				children.push(
					<ImageField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						onChange={onchange()}
						visible={visible[i]}
						first={first}
					/>
				)
				break
			case 'person':
				children.push(
					<PersonField
						key={key}
						pageIndex={currentFormStep}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						disabled={disabled}
						visible={visible[i]}
						inputValue={defaultValue()}
						fieldIndex={i}
						form={form}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'address':
				children.push(
					<AddressField
						key={key}
						pageIndex={currentFormStep}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						disabled={disabled}
						visible={visible[i]}
						inputValue={defaultValue()}
						fieldIndex={i}
						form={form}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'structured_list':
				children.push(
					<StructuredList
						key={key}
						pageIndex={currentFormStep}
						fieldIndex={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						visible={visible[i]}
						first={first}
					/>
				)
				break
			case 'structured_checkbox':
				children.push(
					<StructuredCheckbox
						key={key}
						pageIndex={currentFormStep}
						fieldIndex={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						onChange={onchange((e) => e.target.value)}
						visible={visible[i]}
						first={first}
					/>
				)
				break
			case 'database':
				children.push(
					<DatabaseField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						form={form}
						onChange={onchange()}
						first={first}
					/>
				)
				break
			case 'separator':
				children.push(
					<Divider
						key={key}
						className={isVisible}
						style={{ alignSelf: 'center' }}>
						{pageFieldsData[i].title}
					</Divider>
				)
				break
			default:
				children.push(
					<TextField
						key={key}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						visible={visible[i]}
						onChange={onchange()}
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
	currentFormStep: number,
}

export default InputFactory
