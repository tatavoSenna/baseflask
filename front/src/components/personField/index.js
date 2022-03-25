import React, { useState } from 'react'

import PropTypes, { string, shape, array, bool, object, func } from 'prop-types'

import { Form } from 'antd'

import {
	DisplayNone,
	SBtnGroup,
	SBtnRadio,
	PersonContainer,
	AddressSeparator,
	Lebal,
} from './style'

import LegalPerson from './legalPerson'
import NaturalPerson from './naturalPerson'

const PersonField = ({
	pageFieldsData,
	className,
	disabled,
	inputValue,
	onChange,
}) => {
	const { label, variable, type, fields, id, person_type } = pageFieldsData

	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.type : variable
	const name = id !== undefined ? `${varname}_${id}` : varname
	const [person, setPerson] = useState('')

	return (
		<Form.Item
			key={name}
			label={null}
			type={type}
			className={className}
			hasFeedback
			colon={false}
			style={{ marginBottom: 0 }}>
			<DisplayNone>
				<Form.Item name={variable.name}>
					<></>
				</Form.Item>
			</DisplayNone>
			<Lebal>{label}</Lebal>
			{person_type !== undefined && (
				<Form.Item
					name={[variable.name, 'PERSON_TYPE']}
					initialValue=""
					rules={[{ required: true, message: 'Este campo é obrigatório!' }]}>
					<SBtnGroup
						onChange={(value) => setPerson(value.target.value)}
						btnProps={person}>
						<SBtnRadio value={person_type[1]} onChange={onChange}>
							Pessoa física
						</SBtnRadio>
						<SBtnRadio value={person_type[0]} onChange={onChange}>
							Pessoa jurídica
						</SBtnRadio>
					</SBtnGroup>
				</Form.Item>
			)}
			<PersonContainer>
				{person === 'natural_person' && (
					<NaturalPerson
						fields={fields}
						name={variable.name}
						disabled={disabled}
						onChange={onChange}
						inputValue={inputValue}
					/>
				)}
				{person === 'legal_person' && (
					<LegalPerson
						fields={fields}
						name={variable.name}
						disabled={disabled}
						onChange={onChange}
						inputValue={inputValue}
					/>
				)}
				<AddressSeparator $displayNone={person === ''}>
					Endereço
				</AddressSeparator>
			</PersonContainer>
		</Form.Item>
	)
}

PersonField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([object, string]),
		fields: array,
		person_type: array,
	}).isRequired,
	className: string,
	disabled: bool,
	inputValue: string,
	onChange: func,
}

PersonField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default PersonField
