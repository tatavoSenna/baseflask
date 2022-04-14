import React from 'react'
import { string, shape, array, object, func, bool } from 'prop-types'
import { Form, Checkbox } from 'antd'
import InfoField from '~/components/infoField'

const CheckboxField = ({
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
	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={<InfoField label={label} info={info} />}
			className={className}
			hasFeedback
			type={type}
			colon={false}
			rules={[
				{
					required: !optional,
					message: 'Este campo é obrigatório.',
				},
			]}
			initialValue={
				!inputValue ? '' : Array.isArray(inputValue) ? inputValue : [inputValue]
			}>
			<Checkbox.Group disabled={disabled} onChange={onChange}>
				{options.map((option, index) => (
					<Checkbox key={index} value={option.value}>
						{option.label}
					</Checkbox>
				))}
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
	className: object,
	onChange: func,
	inputValue: array,
	disabled: bool,
}

CheckboxField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CheckboxField
