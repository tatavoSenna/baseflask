import React from 'react'
import { string, shape, array, object, func } from 'prop-types'
import { Form, Slider } from 'antd'
import InfoField from '~/components/infoField'

const SliderField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, type, options, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={<InfoField label={label} info={info} />}
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
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
}

SliderField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default SliderField
