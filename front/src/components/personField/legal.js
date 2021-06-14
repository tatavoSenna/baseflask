import React from 'react'
import { array, number } from 'prop-types'

import CnpjField from '~/components/cnpjField'
import TextField from '~/components/textField'
import StateField from '~/components/stateField'
import CityField from '~/components/cityField'

const LegalPerson = ({ fields, name }) => {
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
							label: 'Razão Social',
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
			case 'cnpj':
				children.push(
					<CnpjField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'cnpj',
							label: 'CNPJ',
							list: name,
							variable: {
								name: 'CNPJ',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'commercial_board':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'Junta Comercial',
							list: name,
							variable: {
								name: 'COMMERCIAL_BOARD',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'nire':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'Nire',
							list: name,
							variable: {
								name: 'NIRE',
								type: 'string',
								doc_display_style: 'plain',
							},
						}}
					/>
				)
				break
			case 'trade_mark':
				children.push(
					<TextField
						key={i}
						first={i === 0}
						pageFieldsData={{
							type: 'text',
							label: 'Nome de fantasia',
							list: name,
							variable: {
								name: 'TRADE_MARK',
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
							label: 'Sala',
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

export default LegalPerson

LegalPerson.propTypes = {
	fields: array,
	name: number,
}
