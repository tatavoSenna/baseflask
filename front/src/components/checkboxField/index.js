import React from 'react'
import { string, shape, array, object, func, number } from 'prop-types'
import { Form, Checkbox } from 'antd'
import InfoField from '~/components/infoField'

const CheckboxField = ({ pageFieldsData, className, onChange, listIndex }) => {
	const { label, variable, type, options, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	const name = isObj ? variable.name : variable
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={listIndex !== undefined ? [listIndex, name] : name}
			label={<InfoField label={label} info={info} />}
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
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
	listIndex: number,
}

CheckboxField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default CheckboxField
