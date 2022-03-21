import PropTypes, { array, bool, func, number, string } from 'prop-types'

import PersonName from './components/personName'
import PersonCPF from './components/personCPF'
import AddressStreet from '../personAddress/addressStreet'
import AddressCountry from '../personAddress/addressCountry'
import AddressCEP from '../personAddress/addressCEP'
import AddressNumber from '../personAddress/addressNumber'
import AddressComplement from '../personAddress/addressComplement'
import AddressCity from '../personAddress/addressCity'
import AddressState from '../personAddress/addressState'
import PersonPronoun from './components/personPronoun'

import styles from './index.module.scss'

const NaturalPerson = ({ fields, name, disabled, onChange, inputValue }) => {
	const components = {
		name: PersonName,
		pronoun: PersonPronoun,
		cpf: PersonCPF,
		country: AddressCountry,
		cep: AddressCEP,
		number: AddressNumber,
		street: AddressStreet,
		complement: AddressComplement,
		city: AddressCity,
		state: AddressState,
	}

	const classNames = [
		styles['name'],
		styles['pronoun'],
		styles['cpf'],
		styles['country'],
		styles['cep'],
		styles['number'],
		styles['street'],
		styles['complement'],
		styles['city'],
		styles['state'],
	]

	const componentsTypes = Object.keys(components)

	return fields.map((field, i) => {
		const dict = {
			key: i,
			first: i === 0,
			name,
			inputValue,
			onChange,
			disabled,
		}

		if (typeof field === 'string') {
			field = { field_type: field, value: '' }
		}

		for (let i = 0; i < componentsTypes.length; i++) {
			if (field.field_type === componentsTypes[i]) {
				dict.inputValue = field.value
				dict.className = classNames[i]
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
