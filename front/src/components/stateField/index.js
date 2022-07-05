import React, { useEffect, useMemo } from 'react'
import PropTypes, { string, shape, object, func, bool } from 'prop-types'
import { Form, Select } from 'antd'
import { getStateField } from '~/states/modules/stateField'
import { useDispatch, useSelector } from 'react-redux'
import InfoField from '~/components/infoField'
import { filterText } from '~/services/filter'

const StateField = ({
	pageFieldsData,
	className,
	onChange,
	form,
	addressData,
	inputValue,
	disabled,
	visible,
}) => {
	const { label, variable, type, id, info, list, optional } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getStateField())
	}, [dispatch])

	const { data } = useSelector(({ stateField }) => stateField)

	const stateOptions = useMemo(() => {
		if (data) {
			return data.map((item) => item.state)
		}

		return []
	}, [data])

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
				onChange={onChange}>
				{stateOptions.map((option, index) => (
					<Select.Option key={index} value={option}>
						{option}
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	)
}

StateField.propTypes = {
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
	visible: bool,
	form: object,
	addressData: object,
}

StateField.defaultProps = {
	className: {},
	onChange: () => null,
	visible: true,
}

export default StateField
