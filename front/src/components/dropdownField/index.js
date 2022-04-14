import React from 'react'
import { string, shape, array, object, func, bool } from 'prop-types'
import { Form, Select } from 'antd'
import InfoField from '~/components/infoField'

const DropdownField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	disabled,
}) => {
	const { label, variable, type, options, id, info, list, optional } =
		pageFieldsData
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
			<Select disabled={disabled} onChange={onChange}>
				{options.map((option, index) => (
					<Select.Option key={index} value={option.value}>
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
	className: string,
	onChange: func,
	inputValue: string,
	disabled: bool,
}

DropdownField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default DropdownField
