import React, { useEffect } from 'react'
import { string, shape, object, func } from 'prop-types'
import { Form, Select } from 'antd'
import { getCnaeField } from '~/states/modules/cnaeField'
import { useDispatch, useSelector } from 'react-redux'

const CnaeField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, type, id } = pageFieldsData
	const isObj = typeof variable === 'object'
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
			name={isObj ? variable.name : variable}
			label={label}
			hasFeedback
			className={className}
			rules={
				typeof className === 'string' &&
				className.slice(0, 19) !== 'inputFactory_hidden' && [
					{ required: true, message: 'Este campo é obrigatório.' },
				]
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
	}).isRequired,
	className: object,
	onChange: func,
}

CnaeField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CnaeField
