import React, { useEffect } from 'react'
import { string, shape, object, func } from 'prop-types'
import { Form, Select } from 'antd'
import { getStateField } from '~/states/modules/stateField'
import { useDispatch, useSelector } from 'react-redux'
import InfoField from '~/components/infoField'

const StateField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, type, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	const dispatch = useDispatch()
	const stateName = []
	useEffect(() => {
		dispatch(getStateField())
	}, [dispatch])
	const data = useSelector(({ stateField }) => stateField)
	if (data.data !== undefined) {
		data.data.map((name, index) => (stateName[index] = name.nome))
	}

	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={<InfoField label={label} info={info} />}
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
				{stateName.map((option, index) => (
					<Select.Option key={index} value={option} onChange={onChange}>
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
	className: object,
	onChange: func,
}

StateField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default StateField
