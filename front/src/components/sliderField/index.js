import React from 'react'
import { string, shape, array, object, func } from 'prop-types'
import { Form, Slider } from 'antd'

const SliderField = ({ pageFieldsData, className, onChange }) => {
	const { value, variable, type, options, id } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={value}
			className={className}
			type={type}
			colon={false}>
			<Slider min={options[0]} max={options[1]}></Slider>
		</Form.Item>
	)
}

SliderField.propTypes = {
	pageFieldsData: shape({
		value: string.isRequired,
		variable: string.isRequired,
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
