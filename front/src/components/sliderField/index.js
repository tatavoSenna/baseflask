import React from 'react'
import { string, shape, array, object, number } from 'prop-types'
import { Form, Slider } from 'antd'
import InfoField from '~/components/infoField'

const SliderField = ({ pageFieldsData, className, listIndex }) => {
	const { label, variable, type, options, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	const name = isObj ? variable.name : variable
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={listIndex !== undefined ? [listIndex, name] : name}
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
	listIndex: number,
}

SliderField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default SliderField
