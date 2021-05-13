import React from 'react'
import { string, shape, array, object, func } from 'prop-types'
import { Form, Radio } from 'antd'
import InfoField from '~/components/infoField'

const RadioField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, type, options, id, info, list } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const hidden =
		typeof className === 'string'
			? className.slice(0, 19) === 'inputFactory_hidden'
			: false
	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
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
}

RadioField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default RadioField
