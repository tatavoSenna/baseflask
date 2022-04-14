import LegalName from '../components/legalName'
import LegalCNPJ from '../components/legalCNPJ'
import LegalActivity from '../components/legalActivity'
import AddressCEP from '../../personAddress/addressCEP'
import AddressCountry from 'components/addressField/fields/components/addressCountry'
import AddressNumber from 'components/addressField/fields/components/addressNumber'
import AddressStreet from 'components/addressField/fields/components/addressStreet'
import AddressComplement from 'components/addressField/fields/components/addressComplement'
import AddressCity from 'components/addressField/fields/components/addressCity'
import AddressState from 'components/addressField/fields/components/addressState'

import styles from '../index.module.scss'
import Name from '../../components/name'
import Surname from '../../components/surname'
import AttorneyCPF from '../../attorneyField/attorneyCPF'
import Pronoun from '../../components/pronoun'
import Email from '../../components/email'
import Profession from '../../components/profession'
import AttorneyCEP from '../../attorneyField/attorneyCEP'
import Identity from '../../components/identity'
import IdentityOrg from '../../components/identityOrg'
import IdentityDate from '../../components/identityDate'

const components = {
	society_name: LegalName,
	cnpj: LegalCNPJ,
	activity: LegalActivity,
	cep: AddressCEP,
	country: AddressCountry,
	number: AddressNumber,
	street: AddressStreet,
	complement: AddressComplement,
	city: AddressCity,
	state: AddressState,
	attorney_cpf: AttorneyCPF,
	attorney_pronoun: Pronoun,
	attorney_name: Name,
	attorney_surname: Surname,
	attorney_identity: Identity,
	attorney_identity_org: IdentityOrg,
	attorney_identity_date: IdentityDate,
	attorney_email: Email,
	attorney_profession: Profession,
	attorney_cep: AttorneyCEP,
	attorney_country: AddressCountry,
	attorney_number: AddressNumber,
	attorney_street: AddressStreet,
	attorney_complement: AddressComplement,
	attorney_city: AddressCity,
	attorney_state: AddressState,
}

const classNames = {
	society_name: styles['society-name'],
	cnpj: styles['cnpj'],
	activity: styles['activity'],
	country: styles['country'],
	cep: styles['cep'],
	number: styles['number'],
	street: styles['street'],
	complement: styles['complement'],
	city: styles['city'],
	state: styles['state'],
	attorney_cpf: styles['attorney-cpf'],
	attorney_pronoun: styles['attorney-pronoun'],
	attorney_name: styles['attorney-name'],
	attorney_surname: styles['attorney-surname'],
	attorney_identity: styles['attorney-identity'],
	attorney_identity_org: styles['attorney-identity-org'],
	attorney_identity_date: styles['attorney-identity-date'],
	attorney_email: styles['attorney-email'],
	attorney_profession: styles['attorney-profession'],
	attorney_country: styles['attorney-country'],
	attorney_cep: styles['attorney-cep'],
	attorney_number: styles['attorney-number'],
	attorney_street: styles['attorney-street'],
	attorney_complement: styles['attorney-complement'],
	attorney_city: styles['attorney-city'],
	attorney_state: styles['attorney-state'],
}

export const getAllComponents = () => {
	return components
}

export const getAllClasses = () => {
	return classNames
}
