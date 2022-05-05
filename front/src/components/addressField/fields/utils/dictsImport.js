import AddressCEP from '../components/addressCEP'
import AddressCity from '../components/addressCity'
import AddressComplement from '../components/addressComplement'
import AddressCountry from '../components/addressCountry'
import AddressDistrict from '../components/addressDistrict'
import AddressNumber from '../components/addressNumber'
import AddressState from '../components/addressState'
import AddressStreet from '../components/addressStreet'

import styles from '../index.module.scss'

const components = {
	cep: AddressCEP,
	country: AddressCountry,
	number: AddressNumber,
	street: AddressStreet,
	complement: AddressComplement,
	state: AddressState,
	district: AddressDistrict,
	city: AddressCity,
}

const classNames = {
	cep: styles['cep'],
	country: styles['country'],
	number: styles['number'],
	street: styles['street'],
	complement: styles['complement'],
	state: styles['state'],
	district: styles['district'],
	city: styles['city'],
}

export const getAllComponents = () => {
	return components
}

export const getAllClasses = () => {
	return classNames
}
