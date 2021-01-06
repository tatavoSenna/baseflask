import React from 'react'
import { object } from 'prop-types'
import RadioField from '../../../../components/radioField'
import CnpjField from '../../../../components/cnpjField'
import CpfField from '../../../../components/cpfField'
import EmailField from '../../../../components/emailField'
import CurrencyField from '../../../../components/currencyField'
import TextField from '../../../../components/textField'
import DropdownField from '../../../../components/dropdownField'

function InputFactory(pageFieldsData) {
	const children = []

	for (let i = 0; i < pageFieldsData.length; i++) {
		const { type } = pageFieldsData[i]
		switch (type) {
			case 'radio':
				children.push(<RadioField key={i} pageFieldsData={pageFieldsData[i]} />)
				break
			case 'cnpj':
				children.push(<CnpjField key={i} pageFieldsData={pageFieldsData[i]} />)
				break
			case 'cpf':
				children.push(<CpfField key={i} pageFieldsData={pageFieldsData[i]} />)
				break
			case 'email':
				children.push(<EmailField key={i} pageFieldsData={pageFieldsData[i]} />)
				break
			case 'currency':
				children.push(
					<CurrencyField key={i} pageFieldsData={pageFieldsData[i]} />
				)
				break
			case 'dropdown':
				children.push(
					<DropdownField key={i} pageFieldsData={pageFieldsData[i]} />
				)
				break
			default:
				children.push(<TextField key={i} pageFieldsData={pageFieldsData[i]} />)
		}
	}

	return children
}

InputFactory.propTypes = {
	content: object.isRequired,
}

export default InputFactory
