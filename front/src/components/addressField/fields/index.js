import AddressCEP from './components/addressCEP'
import AddressCity from './components/addressCity'
import AddressComplement from './components/addressComplement'
import AddressCountry from './components/addressCountry'
import AddressNumber from './components/addressNumber'
import AddressState from './components/addressState'
import AddressStreet from './components/addressStreet'

import styles from './index.module.scss'

const Fields = ({ fields, name, disabled, optional, onChange, inputValue }) => {
	const components = {
		cep: AddressCEP,
		country: AddressCountry,
		number: AddressNumber,
		street: AddressStreet,
		complement: AddressComplement,
		city: AddressCity,
		state: AddressState,
	}

	const classNames = {
		cep: styles['cep'],
		country: styles['country'],
		number: styles['number'],
		street: styles['street'],
		complement: styles['complement'],
		city: styles['city'],
		state: styles['state'],
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
		}

		if (typeof field === 'string') {
			field = { field_type: field, value: '' }
		}

		for (let i = 0; i < componentsTypes.length; i++) {
			if (field.field_type === componentsTypes[i]) {
				dict.inputValue = field.value
				dict.className = classNames[field.field_type]
				dict.fieldType = field.field_type
				return components[field.field_type](dict)
			}
		}

		return null
	})
}

export default Fields
