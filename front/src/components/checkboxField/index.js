import React from 'react'
import { string, shape, array, object, func } from 'prop-types'
import { Form, Checkbox } from 'antd'

const CheckboxField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, type, options, id } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={label}
			className={className}
			hasFeedback
			type={type}
			colon={false}>
			<Checkbox.Group>
				{options.map((option, index) => (
					<Checkbox key={index} value={option.value} onChange={onChange}>
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
	}).isRequired,
	className: object,
	onChange: func,
}

CheckboxField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CheckboxField
