import React, { useCallback, useEffect, useMemo, useState } from 'react'

import PropTypes, {
	string,
	shape,
	array,
	bool,
	object,
	func,
	number,
} from 'prop-types'

import { Button, Form } from 'antd'

import PersonContent from './personContent'
import {
	StyledCollapse,
	StyledHeaderWrapper,
	StyledTextHeader,
	StyledPanel,
	StyledDelete,
	Label,
} from './style'
import moment from 'moment'

const PersonField = ({
	pageFieldsData,
	className,
	inputValue,
	onChange,
	form,
	disabled,
	visible,
	first,
	fieldIndex,
}) => {
	const { label, variable, type, id, person_list, person_type } = pageFieldsData

	const personTypeValue = useMemo(() => {
		if (inputValue === undefined) return ''
		if (!person_list) return inputValue['person_type']

		return Array.isArray(inputValue)
			? inputValue.map((item) => item['person_type'])
			: inputValue['person_type']
	}, [inputValue, person_list])

	const personValue = inputValue !== undefined ? inputValue : {}
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.type : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const value = Array.isArray(inputValue)
		? inputValue.map((objValue) => ({
				...objValue,
				IDENTITY_DATE: moment(
					moment(objValue.IDENTITY_DATE?.substring(0, 10)).format('DD-MM-YYYY'),
					'DD-MM-YYYY'
				),
		  }))
		: []

	const initialPersonListLabel = Array.isArray(inputValue)
		? inputValue.map((e) => {
				return e.PERSON_TYPE === 'legal_person' ? e.SOCIETY_NAME : e.NAME
		  })
		: []

	const [fieldsLength, setFieldsLength] = useState(
		Array.isArray(inputValue) ? inputValue.length : 0
	)

	const [personListLabel, setPersonListCallback, removePersonListLabel] =
		useListLabel(initialPersonListLabel, person_list)

	const [loading, setLoadingCallback, removeLoading] = useLoading(
		person_list,
		fieldsLength
	)

	const [person, setPersonCallback, removePerson] = usePersonType(
		form,
		person_list,
		fieldsLength,
		variable,
		personTypeValue
	)

	useEffect(() => {
		if (!person_list && person_type.length === 1) {
			setPersonCallback(person_type[0])
		}
	}, [person_type, setPersonCallback, person_list])

	useEffect(() => {
		if (person_list && person_type.length === 1 && fieldsLength > 0) {
			setPersonCallback(person_type[0], fieldsLength, 1)
		}
	}, [person_type, setPersonCallback, fieldsLength, person_list])

	useEffect(() => {
		if (!person_list) onChange(person, 'PERSON_TYPE')
	}, [person_list, person, onChange])

	useEffect(() => {
		if (inputValue.length > 0) {
			inputValue.forEach((value, i) => {
				setPersonCallback(value['PERSON_TYPE'], i)
			})
		}
	}, [inputValue, setPersonCallback])

	const personProps = {
		pageFieldsData: pageFieldsData,
		personChange: setPersonCallback,
		listLabelChange: setPersonListCallback,
		person: person,
		disabled: disabled,
		visible: visible,
		onChange: onChange,
		form: form,
		first: first,
		personValue: personValue,
		personTypeValue: personTypeValue,
		name: variable.name,
		loading: loading,
		setLoading: setLoadingCallback,
	}

	return (
		<Form.Item
			key={name + fieldIndex}
			label={null}
			type={type}
			className={className}
			hasFeedback
			colon={false}
			style={{ marginBottom: 0 }}>
			{person_list === true ? (
				<Form.List name={variable.name} initialValue={value}>
					{(fields, { add, remove }) => {
						return (
							<>
								<Label>{label}</Label>
								{fields.map(({ name }) => {
									return (
										<StyledCollapse key={name} bordered={false}>
											<StyledPanel
												header={
													<StyledHeaderWrapper>
														<StyledTextHeader>
															{personListLabel[name] || `Pessoa ${name + 1}`}
														</StyledTextHeader>

														<StyledDelete
															onClick={(e) => {
																e.stopPropagation()
																removePersonListLabel(name)
																removePerson(name)
																removeLoading(name)
																remove(name)
															}}
														/>
													</StyledHeaderWrapper>
												}
												key={name}>
												<PersonContent
													{...personProps}
													name={name}
													length={fields.length}
												/>
											</StyledPanel>
										</StyledCollapse>
									)
								})}

								<Form.Item
									onClick={() => {
										setFieldsLength((value) => value + 1)
										add()
									}}>
									<Button>Adicionar Pessoa</Button>
								</Form.Item>
							</>
						)
					}}
				</Form.List>
			) : (
				<>
					<Label>{label}</Label>
					<PersonContent {...personProps} />
				</>
			)}
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
	inputValue: PropTypes.oneOfType([object, array]),
	onChange: func,
	first: bool,
	fieldIndex: number,
}

PersonField.defaultProps = {
	visible: true,
}

export default PersonField

function useLoading(person_list, length) {
	const [loading, setLoading] = useState(
		person_list ? Array(length).fill(false) : false
	)

	const removeLoading = useCallback(
		(index) => {
			setLoading((load) => load.filter((load, i) => i !== index))
		},
		[setLoading]
	)

	const setLoadingCallback = useCallback(
		(value, index) => {
			if (person_list) {
				setLoading((load) => {
					let newLoad = [...load]
					newLoad[index] = value
					return newLoad
				})
			} else {
				setLoading(value)
			}
		},
		[person_list, setLoading]
	)

	// add loading
	useEffect(() => {
		if (person_list && loading.length < length) {
			setLoading([...loading, false])
		}
	}, [setLoading, person_list, loading, length])

	return [loading, setLoadingCallback, removeLoading]
}

function usePersonType(form, person_list, length, variable, personTypeValue) {
	//person type from form
	const typeForm = useMemo(() => {
		let formValue = form.getFieldValue(variable.name)

		if (formValue === undefined && personTypeValue) return personTypeValue

		if (formValue !== undefined) {
			if (person_list) {
				return formValue.map((t) => t?.PERSON_TYPE ?? '')
			}
			return formValue['PERSON_TYPE']
		}

		return person_list ? Array(length).fill('') : ''
	}, [form, variable, person_list, length, personTypeValue])

	const [person, setPerson] = useState(typeForm)

	const removePerson = useCallback(
		(index) => {
			setPerson((value) => value.filter((load, i) => i !== index))
		},
		[setPerson]
	)

	const setPersonCallback = useCallback(
		(value, index, decrement = 0) => {
			if (person_list) {
				if (index === undefined) {
					setPerson((type) => Array(type.length).fill(value))
				} else {
					setPerson((type) => {
						let newPersonType = [...type]
						newPersonType[index - decrement] = value
						return newPersonType
					})
				}
			} else {
				setPerson(value)
			}
		},
		[person_list, setPerson]
	)

	return [person, setPersonCallback, removePerson]
}

function useListLabel(listLabel, person_list) {
	const [personListLabel, setPersonListLabel] = useState(listLabel)

	const setPersonListCallback = useCallback(
		(value, index) => {
			if (person_list) {
				setPersonListLabel((label) => {
					let newListLabel = [...label]
					newListLabel[index] = value
					return newListLabel
				})
			}
		},
		[setPersonListLabel, person_list]
	)

	const removePersonListLabel = useCallback(
		(index) => {
			setPersonListLabel((label) => label.filter((label, i) => i !== index))
		},
		[setPersonListLabel]
	)

	return [personListLabel, setPersonListCallback, removePersonListLabel]
}
