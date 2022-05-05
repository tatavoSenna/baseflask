import { useState } from 'react'
import { getAllClasses, getAllComponents } from './utils/dictsImport'

const Fields = ({
	fields,
	name,
	disabled,
	optional,
	onChange,
	inputValue,
	form,
}) => {
	const components = getAllComponents()
	const classNames = getAllClasses()

	const componentsTypes = Object.keys(components)

	let fieldState = ''
	if (typeof fields !== 'string') {
		const field = fields.find((f) => f?.field_type === 'state')
		if (field !== undefined) fieldState = field?.value
	}

	const [state, setState] = useState(fieldState)

	const getState = (value) => {
		setState(value)
	}

	return fields.map((field, i) => {
		const dict = {
			key: i,
			first: i === 0,
			name,
			inputValue,
			onChange,
			disabled,
			optional,
			form,
		}

		if (typeof field === 'string') {
			field = { field_type: field, value: '' }
		}

		for (let i = 0; i < componentsTypes.length; i++) {
			if (field.field_type === componentsTypes[i]) {
				dict.className = classNames[field.field_type]
				dict.inputValue = field.value
				dict.fieldType = field.field_type

				if (field.field_type === 'state') dict.onChange = getState

				if (field.field_type === 'city') dict.state = state

				return components[field.field_type](dict)
			}
		}

		return null
	})
}

export default Fields
