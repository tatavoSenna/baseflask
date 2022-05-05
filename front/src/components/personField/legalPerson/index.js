import PropTypes, { array, bool, func, number, string } from 'prop-types'
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
		const field = fields.find((f) => f?.field_type === 'state')
		if (field !== undefined) fieldState = field?.value
	}
	let fieldStateAttorney = ''
	if (typeof fields !== 'string') {
		const field = fields.find((f) => f?.field_type === 'attorney_state')
		if (field !== undefined) fieldState = field?.value
	}

	const components = getAllComponents()
	const classNames = getAllClasses()

	const [state, setState] = useState(fieldState)
	const [stateAttorney, setStateAttorney] = useState(fieldStateAttorney)

	const getState = (value) => {
		setState(value)
	}
	const getStateAttorney = (value) => {
		setStateAttorney(value)
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

				if (field.field_type === 'state') dict.onChange = getState

				if (field.field_type === 'city') dict.state = state

				if (field.field_type === 'attorney_state')
					dict.onChange = getStateAttorney

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
	inputValue: string,
}

export default LegalPerson
