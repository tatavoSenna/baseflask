import { useCepAutocomplete } from 'components/addressField/fields/utils/addressChanges'
import PropTypes, {
	array,
	bool,
	func,
	number,
	object,
	string,
} from 'prop-types'
import { useState, useEffect } from 'react'
import { useCnpjAutocomplete } from './utils/cnpjAutocomplete'

import { getAllClasses, getAllComponents } from './utils/dictsImport'

const LegalPerson = ({
	fields,
	name,
	form,
	inputValue,
	onChange,
	optional,
	disabled,
	visible,
	first,
	getLoading,
	personList,
	variableListName,
	listLabelChange,
}) => {
	const components = getAllComponents()
	const classNames = getAllClasses()

	let fieldState = ''
	let fieldStateAttorney = ''

	if (fields.includes('state')) {
		if (!Array.isArray(inputValue)) {
			fieldState = inputValue['state']
		}
	}

	if (fields.includes('attorney_state')) {
		if (!Array.isArray(inputValue)) {
			fieldState = inputValue['attorney_state']
		}
	}

	const [state, setState] = useState(fieldState)
	const [attorneyState, setStateAttorney] = useState(fieldStateAttorney)

	const [setCep, loadingCep] = useCepAutocomplete(
		form,
		fields,
		name,
		setState,
		personList,
		variableListName
	)

	const [setAttorneyCep, loadingCepAttorney] = useCepAutocomplete(
		form,
		fields,
		name,
		setStateAttorney,
		personList,
		variableListName,
		'attorney_'
	)

	const [setCnpj, loadingCnpj] = useCnpjAutocomplete(
		form,
		fields,
		name,
		setCep,
		personList,
		variableListName,
		listLabelChange
	)

	useEffect(() => {
		getLoading(loadingCnpj || loadingCep ? true : false, name)
	}, [getLoading, loadingCnpj, loadingCep, name])

	useEffect(() => {
		getLoading(loadingCepAttorney ? true : false, name)
	}, [getLoading, loadingCepAttorney, name])

	const componentsTypes = Object.keys(components)

	let hasAttorney = fields.find((f) => f.includes('attorney_')) ? true : false

	const custom_fields = hasAttorney
		? [...fields, 'attorney_title']
		: [...fields]

	return componentsTypes.map((field, i) => {
		const dict = {
			key: i,
			first: i === 0,
			name,
			inputValue,
			onChange,
			disabled,
			visible,
			optional,
			form,
			variableListName,
		}

		if (typeof field === 'string') {
			field = { field_type: field, value: inputValue[field] ?? '' }
		}

		if (i === 0 && first) {
			dict.first = first
		}

		for (let i = 0; i < custom_fields.length; i++) {
			if (field.field_type === custom_fields[i]) {
				dict.inputValue = field.value
				dict.className = classNames[field.field_type]
				dict.fieldType = field.field_type

				let changeCallback = (v) => onChange(v, dict.fieldType.toUpperCase())

				if (field.field_type === 'city') {
					dict.state = state
				}

				if (field.field_type === 'attorney_city') {
					dict.state = attorneyState
				}

				if (field.field_type === 'society_name') {
					dict.onChange = (v) => {
						listLabelChange(v, name)
						changeCallback(v)
					}
				} else if (field.field_type === 'cep') {
					dict.onChange = (v) => {
						setCep(v)
						changeCallback(v)
					}
				} else if (field.field_type === 'state') {
					dict.onChange = (v) => {
						setState(v)
						changeCallback(v)
					}
				} else if (field.field_type === 'attorney_state') {
					dict.onChange = (v) => {
						setStateAttorney(v)
						changeCallback(v)
					}
				} else if (field.field_type === 'attorney_cep') {
					dict.onChange = (v) => {
						setAttorneyCep(v)
						changeCallback(v)
					}
				} else if (field.field_type === 'cnpj') {
					dict.onChange = (v) => {
						setCnpj(v)
						changeCallback(v)
					}
				} else dict.onChange = changeCallback

				return components[field.field_type](dict)
			}
		}

		return null
	})
}

LegalPerson.propTypes = {
	fields: array,
	name: PropTypes.oneOfType([number, string]),
	disabled: bool,
	visible: bool,
	onChange: func,
	inputValue: PropTypes.oneOfType([array, object]),
	getLoading: func,
}

LegalPerson.defaultProps = {
	visible: true,
}

export default LegalPerson
