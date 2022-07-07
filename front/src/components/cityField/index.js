import React, { useEffect, useMemo } from 'react'
import PropTypes, { string, shape, object, func, bool } from 'prop-types'
import { Form, Select } from 'antd'
import { getCityField } from '~/states/modules/cityField'
import { useDispatch, useSelector } from 'react-redux'
import InfoField from '~/components/infoField'
import { filterText } from '~/services/filter'

const CityField = ({
	pageFieldsData,
	className,
	inputValue,
	state,
	form,
	onChange,
	disabled,
	visible,
}) => {
	const { label, variable, type, id, info, list, optional } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const dispatch = useDispatch()

	const { data } = useSelector(({ cityField }) => cityField)

	useEffect(() => {
		dispatch(getCityField())
	}, [dispatch])

	const cityOptions = useMemo(() => {
		if (data) {
			if (state) {
				return data
					.filter((item) => item.state === state)
					.map((item) => item.city)
			} else {
				return data.map((item) => item.city)
			}
		}

		return []
	}, [data, state])

	useEffect(() => {
		if (form) {
			const value = form.getFieldsValue()[list][name] ?? ''
			if (data && value) {
				const city = data.find((item) => value === item.city)
				if (state && city?.state !== state) {
					form.setFieldsValue({ [list]: { [name]: '' } })
				}
			}
		}
	}, [state, data, form, list, name])

	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={<InfoField label={label} info={info} />}
			hasFeedback
			className={className}
			rules={
				visible && [
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
				onChange={(e) => {
					onChange(e)
				}}>
				{cityOptions.map((option, index) => (
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
	visible: bool,
	state: string,
	addressData: object,
}

CityField.defaultProps = {
	className: {},
	onChange: () => null,
	visible: true,
}

export default CityField
