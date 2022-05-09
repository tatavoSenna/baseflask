import React, { useEffect, useState } from 'react'
import PropTypes, { string, shape, object, func, bool } from 'prop-types'
import { Form, Select } from 'antd'
import { getCityField } from '~/states/modules/cityField'
import { useDispatch, useSelector } from 'react-redux'
import InfoField from '~/components/infoField'
import { filterText } from '~/services/filter'

const CityField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	disabled,
	state,
	form,
}) => {
	const { label, variable, type, id, info, list, optional } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname
	const hidden =
		typeof className === 'string'
			? className.slice(0, 19) === 'inputFactory_hidden'
			: false
	const dispatch = useDispatch()
	const cityName = []
	useEffect(() => {
		dispatch(getCityField())
	}, [dispatch])
	const data = useSelector(({ cityField }) => cityField)

	const [thisValue, setThisValue] = useState('')

	const handleOnChange = (value) => {
		setThisValue(value)
		onChange(value)
	}

	const findAndChangeValue = (data, value, _value, stateValue, state) => {
		const _fieldValue = data.data.find((d) => d.nome === value)
		if (_fieldValue !== undefined)
			stateValue =
				_fieldValue['regiao-imediata']['regiao-intermediaria'].UF.nome
		if (stateValue !== state) _value = ''
		return _value
	}

	let inputValueState = state
	let value = thisValue === '' ? inputValue : thisValue
	if (data.data !== undefined) {
		if (state === '' || state === undefined) {
			data.data.map((name, index) => (cityName[index] = name.nome))
		} else {
			const filteredCitys = data.data.filter(
				(d) => d['regiao-imediata']['regiao-intermediaria'].UF.nome === state
			)
			filteredCitys.map((name, index) => (cityName[index] = name.nome))
		}

		if (inputValue !== '' && (state !== '' || state !== undefined)) {
			value = findAndChangeValue(
				data,
				inputValue,
				value,
				inputValueState,
				state
			)
		}

		if ((state !== '' || state !== undefined) && thisValue !== '') {
			value = findAndChangeValue(data, thisValue, value, inputValueState, state)
		}
	}

	useEffect(() => {
		if (form !== undefined) {
			form.setFieldsValue({
				[list]: {
					[name]: value,
				},
			})
		}
	}, [form, state, inputValueState, list, name, value])

	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={<InfoField label={label} info={info} />}
			hasFeedback
			className={className}
			rules={
				!hidden && [
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}
			type={type}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<Select
				allowClear={optional}
				showSearch={true}
				disabled={disabled}
				filterOption={filterText}
				onChange={state === undefined ? onChange : handleOnChange}>
				{cityName.map((option, index) => (
					<Select.Option key={index} value={option}>
						{option}
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	)
}

CityField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	className: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	onChange: func,
	form: object,
	inputValue: string,
	disabled: bool,
	state: string,
}

CityField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CityField
