import React from 'react'
import { string, shape, array, object, func } from 'prop-types'
import { Form, Slider } from 'antd'

const SliderField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, type, options, id } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={label}
			className={className}
			type={type}
			colon={false}>
			<Slider min={options[0]} max={options[1]}></Slider>
		</Form.Item>
	)
}

SliderField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
		options: array.isRequired,
	}).isRequired,
	className: object,
	onChange: func,
}

SliderField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default SliderField
