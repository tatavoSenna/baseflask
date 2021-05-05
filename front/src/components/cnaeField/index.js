import React, { useEffect } from 'react'
import { string, shape, object, func, number } from 'prop-types'
import { Form, Select } from 'antd'
import { getCnaeField } from '~/states/modules/cnaeField'
import { useDispatch, useSelector } from 'react-redux'
import InfoField from '~/components/infoField'

const CnaeField = ({ pageFieldsData, className, onChange, listIndex }) => {
	const { label, variable, type, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	const name = isObj ? variable.name : variable
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
			key={`${isObj ? variable.name : variable}_${id}`}
			name={listIndex !== undefined ? [listIndex, name] : name}
			label={<InfoField label={label} info={info} />}
			hasFeedback
			className={className}
			rules={
				!hidden && [{ required: true, message: 'Este campo é obrigatório.' }]
			}
			type={type}
			colon={false}>
			<Select showSearch={true}>
				{cnaeDescription.map((option, index) => (
					<Select.Option key={index} value={option} onChange={onChange}>
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
	listIndex: number,
}

CnaeField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CnaeField
