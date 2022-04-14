import AddressCEP from '../../personAddress/addressCEP'
import AddressCountry from 'components/addressField/fields/components/addressCountry'
import AddressNumber from 'components/addressField/fields/components/addressNumber'
import AddressStreet from 'components/addressField/fields/components/addressStreet'
import AddressComplement from 'components/addressField/fields/components/addressComplement'
import AddressCity from 'components/addressField/fields/components/addressCity'
import AddressState from 'components/addressField/fields/components/addressState'

import Pronoun from '../../components/pronoun'
import PersonCPF from '../components/personCPF'
import Identity from '../../components/identity'
import IdentityOrg from '../../components/identityOrg'
import IdentityDate from '../../components/identityDate'
import Email from '../../components/email'
import Profession from '../../components/profession'
import PersonMaritalState from '../components/personMaritalState'
import PersonPropertyRegime from '../components/personPropertyRegime'
import Surname from '../../components/surname'
import Name from '../../components/name'

import styles from '../index.module.scss'

const components = {
	cpf: PersonCPF,
	pronoun: Pronoun,
	name: Name,
	surname: Surname,
	identity: Identity,
	identity_org: IdentityOrg,
	identity_date: IdentityDate,
	email: Email,
	marital_state: PersonMaritalState,
	property_regime: PersonPropertyRegime,
	profession: Profession,
	country: AddressCountry,
	cep: AddressCEP,
	number: AddressNumber,
	street: AddressStreet,
	complement: AddressComplement,
	city: AddressCity,
	state: AddressState,
}

const classNames = {
	cpf: styles['cpf'],
	pronoun: styles['pronoun'],
	name: styles['name'],
	surname: styles['surname'],
	identity: styles['identity'],
	identity_org: styles['identity-org'],
	identity_date: styles['identity-date'],
	email: styles['email'],
	marital_state: styles['marital-state'],
	property_regime: styles['property-regime'],
	profession: styles['profession'],
	country: styles['country'],
	cep: styles['cep'],
	number: styles['number'],
	street: styles['street'],
	complement: styles['complement'],
	city: styles['city'],
	state: styles['state'],
}

export const getAllComponents = () => {
	return components
}

export const getAllClasses = () => {
	return classNames
}
