import { useEffect, useState } from 'react'
import { useCepAutocomplete } from './utils/addressChanges'
import { getAllClasses, getAllComponents } from './utils/dictsImport'

const Fields = ({
	fields,
	name,
	disabled,
	visible,
	optional,
	onChange,
	inputValue,
	form,
	first,
	getLoading,
}) => {
	const components = getAllComponents()
	const classNames = getAllClasses()

	let fieldState = ''

	if (fields.includes('state')) {
		if (!Array.isArray(inputValue)) {
			fieldState = inputValue['state']
		}
	}

	const [state, setState] = useState(fieldState)

	const [setCep, loadingCep] = useCepAutocomplete(form, fields, name, setState)

	useEffect(() => {
		getLoading(loadingCep)
	}, [getLoading, loadingCep])

	const componentsTypes = Object.keys(components)

	return componentsTypes.map((field, i) => {
		const dict = {
			key: i,
			name,
			inputValue,
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
				dict.className = classNames[field.field_type]
				dict.inputValue = field.value
				dict.fieldType = field.field_type

				let changeCallback = (v) => onChange(v, dict.fieldType.toUpperCase())

				if (field.field_type === 'city') {
					dict.state = state
				}

				if (field.field_type === 'state')
					dict.onChange = (v) => {
						setState(v)
						changeCallback(v)
					}
				else if (field.field_type === 'cep')
					dict.onChange = (v) => {
						setCep(v)
						changeCallback(v)
					}
				else dict.onChange = changeCallback

				return components[field.field_type](dict)
			}
		}

		return null
	})
}

Fields.defaultProps = {
	visible: true,
}

export default Fields
