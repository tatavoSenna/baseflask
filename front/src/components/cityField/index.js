import React, { useEffect } from 'react'
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
}) => {
	const { label, variable, type, id, info, list } = pageFieldsData
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
	if (data.data !== undefined) {
		data.data.map((name, index) => (cityName[index] = name.nome))
	}

	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={<InfoField label={label} info={info} />}
			hasFeedback
			className={className}
			rules={
				!hidden && [{ required: true, message: 'Este campo é obrigatório.' }]
			}
			type={type}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}
		>
			<Select
				showSearch={true}
				disabled={disabled}
				filterOption={filterText}
				onChange={onChange}
			>
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
	inputValue: string,
	disabled: bool,
}

CityField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CityField
