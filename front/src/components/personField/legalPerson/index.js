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
	form,
	inputValue,
	onChange,
	optional,
	disabled,
	visible,
	first,
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
	visible: bool,
	onChange: func,
	inputValue: object,
}

LegalPerson.defaultProps = {
	visible: true,
}

export default LegalPerson
