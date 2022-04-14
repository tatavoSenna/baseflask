import React, { useEffect } from 'react'
import { string, shape, object, func, bool } from 'prop-types'
import { Form, Select } from 'antd'
import { getCnaeField } from '~/states/modules/cnaeField'
import { useDispatch, useSelector } from 'react-redux'
import InfoField from '~/components/infoField'
import { filterText } from '~/services/filter'

const CnaeField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	disabled,
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
	const cnaeDescription = []
	useEffect(() => {
		dispatch(getCnaeField())
	}, [dispatch])
	const data = useSelector(({ cnaeField }) => cnaeField)
	if (data.data !== undefined) {
		data.data.map(
			(description, index) => (cnaeDescription[index] = description.descricao)
		)
	}

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
				showSearch={true}
				disabled={disabled}
				filterOption={filterText}
				onChange={onChange}>
				{cnaeDescription.map((option, index) => (
					<Select.Option key={index} value={option}>
						{option}
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	)
}

CnaeField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
	inputValue: string,
	disabled: bool,
}

CnaeField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CnaeField
