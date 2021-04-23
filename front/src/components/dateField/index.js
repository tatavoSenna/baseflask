import React from 'react'
import { string, shape, object, func } from 'prop-types'
import { Form, DatePicker } from 'antd'
import InfoField from '~/components/infoField'

const DateField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, type, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={<InfoField label={label} info={info} />}
			type={type}
			className={className}
			onChange={onChange}
			hasFeedback
			rules={
				typeof className === 'string' &&
				className.slice(0, 19) !== 'inputFactory_hidden' && [
					{ required: true, message: 'Este campo é obrigatório.' },
				]
			}
			colon={false}>
			<DatePicker format={'DD-MM-YYYY'} placeholder={''} />
		</Form.Item>
	)
}

DateField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
}

export default DateField
