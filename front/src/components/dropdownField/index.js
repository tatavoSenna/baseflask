import React from 'react'
import { string, shape, array, object, func } from 'prop-types'
import { Form, Select } from 'antd'
import InfoField from '~/components/infoField'

const DropdownField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, type, options, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
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
			<Select>
				{options.map((option, index) => (
					<Select.Option key={index} value={option.value} onChange={onChange}>
						{option.label}
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	)
}

DropdownField.propTypes = {
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

DropdownField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default DropdownField
