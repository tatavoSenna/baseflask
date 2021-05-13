import React from 'react'
import { string, shape, array, object } from 'prop-types'
import { Form, Slider } from 'antd'
import InfoField from '~/components/infoField'

const SliderField = ({ pageFieldsData, className }) => {
	const { label, variable, type, options, id, info, list } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname
	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
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
}

SliderField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default SliderField
