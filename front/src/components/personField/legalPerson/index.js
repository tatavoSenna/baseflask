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

	const [setCep, loadingCep] = useCepAutocomplete(form, fields, name, setState)
	const [setAttorneyCep, loadingCepAttorney] = useCepAutocomplete(
		form,
		fields,
		name,
		setStateAttorney,
		'attorney_'
	)

	const [setCnpj, loadingCnpj] = useCnpjAutocomplete(form, fields, name, setCep)

	useEffect(() => {
		if (loadingCnpj || loadingCep) getLoading(true)
		if (!loadingCnpj && !loadingCep) getLoading(false)
	}, [getLoading, loadingCnpj, loadingCep])

	useEffect(() => {
		getLoading(loadingCepAttorney)
	}, [getLoading, loadingCepAttorney])

	const componentsTypes = Object.keys(components)

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
		}

		if (typeof field === 'string') {
			field = { field_type: field, value: inputValue[field] ?? '' }
		}

		if (i === 0 && first) {
			dict.first = first
		}

		for (let i = 0; i < fields.length; i++) {
			if (field.field_type === fields[i]) {
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

				if (field.field_type === 'cep') {
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
	inputValue: object,
	getLoading: func,
}

LegalPerson.defaultProps = {
	visible: true,
}

export default LegalPerson
