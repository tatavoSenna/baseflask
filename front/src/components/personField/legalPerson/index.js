import PropTypes, {
	array,
	bool,
	func,
	number,
	object,
	string,
} from 'prop-types'
import { useState } from 'react'
import { getAllClasses, getAllComponents } from './utils/dictsImport'

const LegalPerson = ({
	fields,
	name,
	disabled,
	optional,
	onChange,
	inputValue,
	form,
}) => {
	let fieldState = ''
	if (typeof fields !== 'string') {
		const field = fields.find((f) => f === 'state')
		if (field !== undefined) fieldState = inputValue[field]
	}

	let fieldStateAttorney = ''
	if (typeof fields !== 'string') {
		const field = fields.find((f) => f === 'attorney_state')
		if (field !== undefined) fieldStateAttorney = inputValue[field]
	}

	const components = getAllComponents()
	const classNames = getAllClasses()

	const [state, setState] = useState(fieldState)
	const [stateAttorney, setStateAttorney] = useState(fieldStateAttorney)

	const componentsTypes = Object.keys(components)

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
			field = { field_type: field, value: inputValue[field] ?? '' }
		}

		for (let i = 0; i < componentsTypes.length; i++) {
			if (field.field_type === componentsTypes[i]) {
				dict.inputValue = field.value
				dict.className = classNames[field.field_type]
				dict.fieldType = field.field_type

				let changeCallback = (v) => onChange(v, dict.fieldType.toUpperCase())

				if (field.field_type === 'state')
					dict.onChange = (v) => {
						setState(v)
						changeCallback(v)
					}
				else if (field.field_type === 'attorney_state')
					dict.onChange = (v) => {
						setStateAttorney(v)
						changeCallback(v)
					}
				else dict.onChange = changeCallback

				if (field.field_type === 'city') dict.state = state
				if (field.field_type === 'attorney_city') dict.state = stateAttorney

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
	onChange: func,
	inputValue: object,
}

export default LegalPerson
