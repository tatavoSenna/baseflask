import React from 'react'
import { Form, Spin } from 'antd'
import LegalPerson from '../legalPerson'
import NaturalPerson from '../naturalPerson'
import { PersonContainer, PersonTitle, SBtnGroup, SBtnRadio } from '../style'

import PropTypes, {
	string,
	shape,
	array,
	bool,
	object,
	func,
	number,
} from 'prop-types'

const PersonContent = ({
	pageFieldsData,
	personChange,
	person,
	disabled,
	visible,
	onChange,
	form,
	first,
	personValue,
	personTypeValue,
	name,
	loading,
	setLoading,
	listLabelChange,
}) => {
	const { fields, person_type, optional, person_list, variable } =
		pageFieldsData

	const personProps = {
		fields: fields,
		name: name,
		disabled: disabled,
		visible: visible,
		optional: optional,
		onChange: onChange,
		form: form,
		first: first,
		inputValue: personValue,
		getLoading: setLoading,
		personList: person_list,
		variableListName: variable.name,
		listLabelChange: listLabelChange,
	}

	return (
		<>
			{person_type !== undefined && person_type.length > 1 ? (
				<Form.Item
					name={[name, 'PERSON_TYPE']}
					initialValue={personTypeValue}
					rules={
						visible && [
							{ required: !optional, message: 'Este campo é obrigatório!' },
						]
					}>
					<SBtnGroup
						onChange={(e) => personChange(e.target.value, name)}
						btnProps={person}>
						<SBtnRadio value="natural_person">Pessoa física</SBtnRadio>
						<SBtnRadio value="legal_person">Pessoa jurídica</SBtnRadio>
					</SBtnGroup>
				</Form.Item>
			) : (
				<Form.Item name={[name, 'PERSON_TYPE']} initialValue={person_type[0]}>
					<PersonTitle>
						{person_list
							? person[name] === 'natural_person'
								? 'Pessoa física'
								: 'Pessoa jurídica'
							: person === 'natural_person'
							? 'Pessoa física'
							: 'Pessoa jurídica'}
					</PersonTitle>
				</Form.Item>
			)}
			<Spin
				spinning={person_list ? loading[name] : loading}
				tip="Carregando dados">
				<PersonContainer>
					{person_list
						? person[name] === 'natural_person' && (
								<NaturalPerson {...personProps} />
						  )
						: person === 'natural_person' && <NaturalPerson {...personProps} />}
					{person_list
						? person[name] === 'legal_person' && (
								<LegalPerson {...personProps} />
						  )
						: person === 'legal_person' && <LegalPerson {...personProps} />}
				</PersonContainer>
			</Spin>
		</>
	)
}

export default PersonContent

PersonContent.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([object, string]),
		fields: array,
		person_type: array,
		optional: bool,
	}).isRequired,
	personChange: func,
	person: PropTypes.oneOfType([array, string]),
	disabled: bool,
	visible: bool,
	onChange: func,
	form: object,
	first: bool,
	personValue: PropTypes.oneOfType([array, object]),
	personTypeValue: PropTypes.oneOfType([array, string]),
	name: PropTypes.oneOfType([number, string]),
	length: number,
	loading: PropTypes.oneOfType([bool, array]),
	setLoading: func,
	listLabelChange: func,
}
