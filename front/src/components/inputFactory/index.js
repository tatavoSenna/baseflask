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
import AddressField from '~/components/addressField'

import { Divider } from 'antd'
import { useDispatch } from 'react-redux'
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
		if (typeof form !== 'undefined')
			dispatch(
				updateVisible({
					form,
				})
			)
	}, [dispatch, form, currentFormStep])

	for (let i = 0; i < pageFieldsData.length; i++) {
		const { type, conditional, initialValue, variable } = pageFieldsData[i]
		const isVisible = visible[i] ? styles['default-style'] : styles.hidden

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
			conditional
				? (e) =>
						dispatch(
							updateVisible({
								input: selector(e),
								form,
								fieldIndex: i,
								pageIndex: currentFormStep,
							})
						)
				: undefined

		switch (type) {
			case 'radio':
				children.push(
					<RadioField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange((e) => e.target.value)}
					/>
				)
				break
			case 'cnpj':
				children.push(
					<CnpjField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange((e) => e.target.value)}
						first={first}
					/>
				)
				break
			case 'cpf':
				children.push(
					<CpfField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange((e) => e.target.value)}
						first={first}
					/>
				)
				break
			case 'email':
				children.push(
					<EmailField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange((e) => e.target.value)}
						first={first}
					/>
				)
				break
			case 'currency':
				children.push(
					<CurrencyField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange()}
					/>
				)
				break
			case 'dropdown':
				children.push(
					<DropdownField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange()}
					/>
				)
				break
			case 'date':
				children.push(
					<DateField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange()}
					/>
				)
				break
			case 'time':
				children.push(
					<TimeField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange((e) => e.target.value)}
					/>
				)
				break
			case 'state':
				children.push(
					<StateField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange()}
					/>
				)
				break
			case 'checkbox':
				children.push(
					<CheckboxField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange()}
					/>
				)
				break
			case 'cnae':
				children.push(
					<CnaeField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange()}
					/>
				)
				break
			case 'city':
				children.push(
					<CityField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange()}
					/>
				)
				break
			case 'slider':
				children.push(
					<SliderField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange()}
					/>
				)
				break
			case 'number':
				children.push(
					<NumberField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange()}
					/>
				)
				break
			case 'percentage':
				children.push(
					<PercentageField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange()}
					/>
				)
				break
			case 'bank':
				children.push(
					<BankField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange()}
					/>
				)
				break

			case 'variable_file':
				children.push(
					<FileField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
					/>
				)
				break
			case 'text_area':
				children.push(
					<TextAreaField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange((e) => e.target.value)}
					/>
				)
				break
			case 'variable_image':
				children.push(
					<ImageField
						key={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						onChange={onchange()}
					/>
				)
				break
			case 'person':
				children.push(
					<PersonField
						key={i}
						pageIndex={currentFormStep}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						disabled={disabled}
						inputValue={defaultValue()}
						fieldIndex={i}
						onChange={onchange()}
						form={form}
					/>
				)
				break
			case 'address':
				children.push(
					<AddressField
						key={i}
						pageIndex={currentFormStep}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						disabled={disabled}
						inputValue={defaultValue()}
						fieldIndex={i}
						onChange={onchange((e) => e.target.value)}
					/>
				)
				break
			case 'structured_list':
				children.push(
					<StructuredList
						key={i}
						pageIndex={currentFormStep}
						fieldIndex={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
					/>
				)
				break
			case 'structured_checkbox':
				children.push(
					<StructuredCheckbox
						key={i}
						pageIndex={currentFormStep}
						fieldIndex={i}
						pageFieldsData={pageFieldsData[i]}
						className={isVisible}
						onChange={onchange((e) => e.target.value)}
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
						className={isVisible}
						inputValue={defaultValue()}
						disabled={disabled}
						onChange={onchange((e) => e.target.value)}
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
