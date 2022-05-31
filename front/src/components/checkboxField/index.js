import React from 'react'
import PropTypes, { string, shape, array, object, func, bool } from 'prop-types'
import { Form, Checkbox, Space } from 'antd'
import InfoField from '~/components/infoField'

const CheckboxField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	disabled,
	visible,
}) => {
	const { label, variable, type, options, id, info, list, optional } =
		pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname
	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={<InfoField label={label} info={info} />}
			className={className}
			hasFeedback
			type={type}
			colon={false}
			rules={
				visible && [
					{
						required: !optional,
						message: 'Este campo é obrigatório.',
					},
				]
			}
			initialValue={
				!inputValue ? '' : Array.isArray(inputValue) ? inputValue : [inputValue]
			}>
			<Checkbox.Group disabled={disabled} onChange={onChange}>
				<Space direction="vertical" size={12}>
					{options.map((option, index) => (
						<Checkbox key={index} value={option.value}>
							{option.label}
						</Checkbox>
					))}
				</Space>
			</Checkbox.Group>
		</Form.Item>
	)
}

CheckboxField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
		options: array.isRequired,
		info: string,
	}).isRequired,
	className: string,
	onChange: func,
	inputValue: PropTypes.oneOfType([array, string]),
	disabled: bool,
	visible: bool,
}

CheckboxField.defaultProps = {
	onChange: () => null,
	visible: true,
}

export default CheckboxField
