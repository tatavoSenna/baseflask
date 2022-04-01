import { useEffect, useState } from 'react'
import PropTypes, {
	array,
	bool,
	func,
	number,
	object,
	string,
} from 'prop-types'

import LegalName from './components/legalName'
import LegalCNPJ from './components/legalCNPJ'
import AddressStreet from '../personAddress/addressStreet'
import AddressCountry from '../personAddress/addressCountry'
import AddressCEP from '../personAddress/addressCEP'
import AddressNumber from '../personAddress/addressNumber'
import AddressComplement from '../personAddress/addressComplement'
import AddressCity from '../personAddress/addressCity'
import AddressState from '../personAddress/addressState'

import { getLegalInfo } from 'states/modules/cnpjField'
import { useSelector, useDispatch } from 'react-redux'

import styles from './index.module.scss'

const LegalPerson = ({
	fields,
	name,
	disabled,
	onChange,
	inputValue,
	form,
}) => {
	const dispatch = useDispatch()

	const components = {
		society_name: LegalName,
		cnpj: LegalCNPJ,
		country: AddressCountry,
		cep: AddressCEP,
		number: AddressNumber,
		street: AddressStreet,
		complement: AddressComplement,
		city: AddressCity,
		state: AddressState,
	}

	const classNames = [
		styles['society-name'],
		styles['cnpj'],
		styles['country'],
		styles['cep'],
		styles['number'],
		styles['street'],
		styles['complement'],
		styles['city'],
		styles['state'],
	]

	const [cnpj, setCnpj] = useState('')

	const legalInfo = useSelector(({ legalInfo }) => legalInfo.legalInfo[cnpj])

	const getCnpjValue = (e) => {
		setCnpj(e.target.value.replace(/[^0-9]/g, ''))
	}

	useEffect(() => {
		if (cnpj.length === 14) {
			dispatch(getLegalInfo(cnpj))
		}
	}, [cnpj, dispatch])

	const componentsTypes = Object.keys(components)

	return fields.map((field, i) => {
		const dict = {
			key: i,
			first: i === 0,
			name,
			inputValue,
			onChange,
			disabled,
			legalData: legalInfo,
			form,
		}

		if (typeof field === 'string') {
			field = { field_type: field, value: '' }
		}

		for (let i = 0; i < componentsTypes.length; i++) {
			if (field.field_type === componentsTypes[i]) {
				dict.inputValue = field.value
				dict.className = classNames[i]
				if (field.field_type === 'cnpj') {
					dict.onChange = getCnpjValue
				}

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
	form: object,
}

export default LegalPerson
