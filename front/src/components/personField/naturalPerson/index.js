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

const NaturalPerson = ({
	fields,
	name,
	disabled,
	optional,
	onChange,
	inputValue,
	form,
}) => {
	let fieldMarital = ''
	if (typeof fields !== 'string') {
		const field = fields.find((f) => f === 'marital_state')
		if (field !== undefined) fieldMarital = inputValue[field]
	}

	let fieldState = ''
	if (typeof fields !== 'string') {
		const field = fields.find((f) => f === 'state')
		if (field !== undefined) fieldState = inputValue[field]
	}

	const components = getAllComponents()
	const classNames = getAllClasses()

	const [pronoun, setPronoun] = useState('')
	const [maritalState, setMaritalState] = useState(fieldMarital)
	const [state, setState] = useState(fieldState)

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
				else if (field.field_type === 'pronoun')
					dict.onChange = (v) => {
						setPronoun(v)
						changeCallback(v)
					}
				else if (field.field_type === 'marital_state') {
					dict.pronoun = pronoun
					dict.onChange = (v) => {
						setMaritalState(v)
						changeCallback(v)
					}
				} else dict.onChange = changeCallback

				if (field.field_type === 'city') dict.state = state
				if (field.field_type === 'property_regime')
					dict.maritalState = maritalState

				return components[field.field_type](dict)
			}
		}

		return null
	})
}

NaturalPerson.propTypes = {
	fields: array,
	name: PropTypes.oneOfType([number, string]),
	disabled: bool,
	onChange: func,
	inputValue: object,
}

export default NaturalPerson
