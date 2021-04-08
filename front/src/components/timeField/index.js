import React from 'react'
import { string, shape, func, object } from 'prop-types'
import { Form } from 'antd'
import { validateTime } from '../../utils'
import MaskedInput from 'antd-mask-input'

const TimeField = ({ pageFieldsData, className, onChange }) => {
	const { value, variable, id } = pageFieldsData
	return (
		<Form.Item
			key={`${variable}_${id}`}
			name={variable}
			label={value}
			className={className}
			onChange={onChange}
			hasFeedback
			rules={
				className !== 'inputFactory_hidden__18I0s' && [
					() => ({
						validator(rule, value) {
							if (!value) {
								return Promise.reject('Este campo é obrigatório.')
							}
							if (validateTime(value)) {
								return Promise.resolve()
							}
							return Promise.reject('Horário não é válido.')
						},
					}),
				]
			}
			colon={false}>
			<MaskedInput mask="11:11" placeholder="" style={{ width: '39.2%' }} />
		</Form.Item>
	)
}

TimeField.propTypes = {
	pageFieldsData: shape({
		value: string.isRequired,
		variable: string.isRequired,
	}).isRequired,
	className: object,
	onChange: func,
}

TimeField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default TimeField
