import React from 'react'
import { string, shape, func, object } from 'prop-types'
import { Form } from 'antd'
import { validateTime } from '../../utils'
import MaskedInput from 'antd-mask-input'
import InfoField from '~/components/infoField'

const TimeField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, id, info } = pageFieldsData
	return (
		<Form.Item
			key={`${variable}_${id}`}
			name={variable}
			label={<InfoField label={label} info={info} />}
			className={className}
			onChange={onChange}
			hasFeedback
			rules={
				typeof className === 'string' &&
				className.slice(0, 19) !== 'inputFactory_hidden' && [
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
		label: string.isRequired,
		variable: object.isRequired,
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
}

TimeField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default TimeField
