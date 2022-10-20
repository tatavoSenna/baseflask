import React, { useCallback, useEffect, useMemo, useState } from 'react'

import PropTypes, { string, shape, array, bool, object, func } from 'prop-types'

import { Form, Spin } from 'antd'

import {
	DisplayNone,
	SBtnGroup,
	SBtnRadio,
	PersonContainer,
	Label,
	PersonTitle,
} from './style'

import LegalPerson from './legalPerson'
import NaturalPerson from './naturalPerson'

const PersonField = ({
	pageFieldsData,
	className,
	inputValue,
	onChange,
	form,
	disabled,
	visible,
	first,
}) => {
	const { label, variable, type, fields, id, person_type, optional } =
		pageFieldsData

	const _value = inputValue !== undefined ? inputValue['person_type'] : ''

	const _personValue = inputValue !== undefined ? inputValue : {}
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.type : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const personTypeFromForm = useMemo(() => {
		return form.getFieldValue([variable.name, 'PERSON_TYPE']) ?? _value
	}, [form, _value, variable.name])

	const [person, setPerson] = useState(personTypeFromForm)

	useEffect(() => {
		if (person_type.length === 1) {
			setPerson(person_type[0])
		}
	}, [person_type])

	const personChange = useCallback(
		(e) => {
			const value = e.target.value
			setPerson(value)
			onChange(value, 'PERSON_TYPE')
		},
		[setPerson, onChange]
	)

	const [loading, setLoading] = useState(false)

	const getLoading = useCallback(
		(isLoading) => {
			setLoading(isLoading)
		},
		[setLoading]
	)

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
			<Label>{label}</Label>
			{person_type !== undefined && person_type.length > 1 ? (
				<Form.Item
					name={[variable.name, 'PERSON_TYPE']}
					initialValue={_value}
					rules={
						visible && [
							{ required: !optional, message: 'Este campo é obrigatório!' },
						]
					}>
					<SBtnGroup onChange={personChange} btnProps={person}>
						<SBtnRadio value="natural_person">Pessoa física</SBtnRadio>
						<SBtnRadio value="legal_person">Pessoa jurídica</SBtnRadio>
					</SBtnGroup>
				</Form.Item>
			) : (
				<Form.Item
					name={[variable.name, 'PERSON_TYPE']}
					initialValue={person_type[0]}>
					<PersonTitle>
						{person === 'natural_person' ? 'Pessoa física' : 'Pessoa jurídica'}
					</PersonTitle>
				</Form.Item>
			)}
			<Spin spinning={loading} tip="Carregando dados">
				<PersonContainer>
					{person === 'natural_person' && (
						<NaturalPerson
							fields={fields}
							name={variable.name}
							disabled={disabled}
							visible={visible}
							optional={optional}
							onChange={onChange}
							form={form}
							first={first}
							inputValue={_personValue}
							getLoading={getLoading}
						/>
					)}
					{person === 'legal_person' && (
						<LegalPerson
							fields={fields}
							name={variable.name}
							disabled={disabled}
							visible={visible}
							optional={optional}
							onChange={onChange}
							inputValue={_personValue}
							form={form}
							first={first}
							getLoading={getLoading}
						/>
					)}
				</PersonContainer>
			</Spin>
		</Form.Item>
	)
}

PersonField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([object, string]),
		fields: array,
		person_type: array,
		optional: bool,
	}).isRequired,
	className: string,
	form: object,
	disabled: bool,
	visible: bool,
	inputValue: object,
	onChange: func,
	first: bool,
}

PersonField.defaultProps = {
	visible: true,
}

export default PersonField
