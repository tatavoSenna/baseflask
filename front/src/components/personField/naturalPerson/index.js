import PropTypes, { array, bool, func, number, string } from 'prop-types'
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
		const field = fields.find((f) => f?.field_type === 'marital_state')
		if (field !== undefined) fieldMarital = field?.value
	}

	let fieldState = ''
	if (typeof fields !== 'string') {
		const field = fields.find((f) => f?.field_type === 'state')
		if (field !== undefined) fieldState = field?.value
	}

	const components = getAllComponents()
	const classNames = getAllClasses()

	const [pronoun, setPronoun] = useState('')
	const [maritalState, setMaritalState] = useState(fieldMarital)
	const [state, setState] = useState(fieldState)

	const getPronuounValue = (value) => {
		setPronoun(value)
	}

	const getMaritalStateValue = (value) => {
		setMaritalState(value)
	}

	const getState = (value) => {
		setState(value)
	}

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
			field = { field_type: field, value: '' }
		}

		for (let i = 0; i < componentsTypes.length; i++) {
			if (field.field_type === componentsTypes[i]) {
				dict.inputValue = field.value
				dict.className = classNames[field.field_type]
				dict.fieldType = field.field_type

				if (field.field_type === 'pronoun') dict.onChange = getPronuounValue

				if (field.field_type === 'marital_state') {
					dict.pronoun = pronoun
					dict.onChange = getMaritalStateValue
				}

				if (field.field_type === 'property_regime')
					dict.maritalState = maritalState

				if (field.field_type === 'state') dict.onChange = getState

				if (field.field_type === 'city') dict.state = state

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
	inputValue: string,
}

export default NaturalPerson
