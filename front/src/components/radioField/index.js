import React from 'react'
import { string, shape, array, object, func, number } from 'prop-types'
import { Form, Radio } from 'antd'
import InfoField from '~/components/infoField'

const RadioField = ({ pageFieldsData, className, onChange, listIndex }) => {
	const { label, variable, type, options, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	const name = isObj ? variable.name : variable
	const hidden =
		typeof className === 'string'
			? className.slice(0, 19) === 'inputFactory_hidden'
			: false
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={listIndex !== undefined ? [listIndex, name] : name}
			label={<InfoField label={label} info={info} />}
			className={className}
			hasFeedback
			rules={
				!hidden && [{ required: true, message: 'Este campo é obrigatório.' }]
			}
			type={type}
			colon={false}>
			<Radio.Group>
				{options.map((option, index) => (
					<Radio key={index} value={option.value} onChange={onChange}>
						{option.label}
					</Radio>
				))}
			</Radio.Group>
		</Form.Item>
	)
}

RadioField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
		options: array.isRequired,
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
	listIndex: number,
}

RadioField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default RadioField
