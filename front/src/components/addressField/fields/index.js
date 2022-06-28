import { useState } from 'react'
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
}) => {
	const components = getAllComponents()
	const classNames = getAllClasses()

	const componentsTypes = Object.keys(components)

	let fieldState = ''
	if (typeof fields !== 'string') {
		const field = fields.find((f) => f === 'state')
		if (field !== undefined) fieldState = inputValue[field]
	}

	const [state, setState] = useState(fieldState)

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

				if (field.field_type === 'city') dict.state = state
				if (field.field_type === 'state')
					dict.onChange = (v) => {
						setState(v)
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
