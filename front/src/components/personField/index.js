import React, { useState } from 'react'

import PropTypes, {
	string,
	shape,
	array,
	number,
	bool,
	object,
	func,
} from 'prop-types'

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
	pageIndex,
	disabled,
	inputValue,
	fieldIndex,
	onChange,
}) => {
	const { label, variable, type, fields, id, person_type, initialValue } =
		pageFieldsData

	const objName = `person_${pageIndex}_${fieldIndex}`
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.type : variable
	const name = id !== undefined ? `${varname}_${id}` : varname
	const [person, setPerson] = useState(initialValue)

	return (
		<Form.Item
			key={name}
			label={null}
			type={type}
			className={className}
			hasFeedback
			colon={false}
			style={{ marginBottom: 0 }}
		>
			<DisplayNone>
				<Form.Item
					name={[objName, 'VARIABLE_NAME']}
					initialValue={variable.name}
				>
					<></>
				</Form.Item>
			</DisplayNone>
			<Lebal>{label}</Lebal>
			{person_type !== undefined && (
				<Form.Item
					name={[objName, 'PERSON_TYPE']}
					initialValue=""
					rules={[{ required: true, message: 'Este campo é obrigatório!' }]}
				>
					<SBtnGroup
						onChange={(value) => setPerson(value.target.value)}
						btnProps={person}
					>
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
						name={objName}
						disabled={disabled}
						onChange={onChange}
						inputValue={inputValue}
					/>
				)}
				{person === 'legal_person' && (
					<LegalPerson
						fields={fields}
						name={objName}
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
		type: string.isRequired,
		person_type: array,
		initialValue: string,
	}).isRequired,
	className: string,
	pageIndex: number,
	fieldIndex: number,
	disabled: bool,
	inputValue: string,
	onChange: func,
}

PersonField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default PersonField
