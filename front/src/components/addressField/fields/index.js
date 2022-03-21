import AddressCEP from './components/addressCEP'
import AddressCity from './components/addressCity'
import AddressComplement from './components/addressComplement'
import AddressCountry from './components/addressCountry'
import AddressNumber from './components/addressNumber'
import AddressState from './components/addressState'
import AddressStreet from './components/addressStreet'

const Fields = ({ fields, name, disabled, onChange, inputValue }) => {
	const components = {
		country: AddressCountry,
		cep: AddressCEP,
		number: AddressNumber,
		street: AddressStreet,
		complement: AddressComplement,
		city: AddressCity,
		state: AddressState,
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
		}

		if (typeof field === 'string') {
			field = { field_type: field, value: '' }
		}

		for (let i = 0; i < componentsTypes.length; i++) {
			if (field.field_type === componentsTypes[i]) {
				dict.inputValue = field.value
				dict.className = ''
				return components[field.field_type](dict)
			}
		}

		return null
	})
}

export default Fields
