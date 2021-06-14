import React from 'react'
import { array, number } from 'prop-types'

import CpfField from '~/components/cpfField'
import TextField from '~/components/textField'
import DropdownField from '~/components/dropdownField'
import StateField from '~/components/stateField'
import CityField from '~/components/cityField'

const NaturalPerson = ({ fields, name }) => {
	const children = []
	fields.forEach((field, i) => {
		switch (field) {
			case 'name':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'Nome Completo',
							list: name,
							variable: {
								name: 'NAME',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'nationality':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'Nacionalidade',
							list: name,
							variable: {
								name: 'NATIONALITY',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'martial_status':
				children.push(
					<DropdownField
						key={i}
						pageFieldsData={{
							type: 'dropdown',
							label: 'Estado Civil',
							options: [
								{ label: 'Solteiro(a)', value: 'Solteiro(a)' },
								{ label: 'Casado(a)', value: 'Casado(a)' },
								{ label: 'Divorciado(a)', value: 'Divorciado(a)' },
								{ label: 'Viúvo(a)', value: 'Viúvo(a)' },
								{ label: 'Separado(a)', value: 'Separado(a)' },
							],
							list: name,
							variable: {
								name: 'MARTIAL_STATUS',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'profession':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'Profissão',
							list: name,
							variable: {
								name: 'PROFESSION',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break

			case 'cpf':
				children.push(
					<CpfField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'cpf',
							label: 'CPF',
							list: name,
							variable: {
								name: 'CPF',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'rg':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'RG',
							list: name,
							variable: {
								name: 'RG',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'issued_by':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'Expedida por',
							list: name,
							variable: {
								name: 'ISSUED_BY',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'address':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'Logradouro',
							list: name,
							variable: {
								name: 'ADDRESS',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'street_number':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'Número',
							list: name,
							variable: {
								name: 'STREET_NUMBER',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'room_number':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'Apartamento',
							list: name,
							variable: {
								name: 'ROOM_NUMBER',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'district':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'Bairro',
							list: name,
							variable: {
								name: 'DISTRICT',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'city':
				children.push(
					<CityField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'city',
							label: 'Cidade',
							list: name,
							variable: {
								name: 'CITY',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'state':
				children.push(
					<StateField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'state',
							label: 'Estado',
							list: name,
							variable: {
								name: 'STATE',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'zip':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'CEP',
							list: name,
							variable: {
								name: 'ZIP',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			default:
				break
		}
	})
	return children
}

export default NaturalPerson

NaturalPerson.propTypes = {
	fields: array,
	name: number,
}
