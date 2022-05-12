import React from 'react'
import PropTypes, {
	string,
	shape,
	func,
	object,
	number,
	bool,
} from 'prop-types'
import { Form, TimePicker } from 'antd'
import InfoField from '~/components/infoField'
import { validateTime } from 'utils'

const TimeField = ({
	pageFieldsData,
	className,
	onChange,
	listIndex,
	inputValue,
	disabled,
}) => {
	const { label, variable, type, id, info, minute_step, optional } =
		pageFieldsData
	const isObj = typeof variable === 'object'
	const name = isObj ? variable.name : variable
	const hidden =
		typeof className === 'string'
			? className.slice(0, 19) === 'inputFactory_hidden'
			: false

	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={listIndex !== undefined ? [listIndex, name] : name}
			label={<InfoField label={label} info={info} />}
			type={type}
			className={className}
			hasFeedback
			rules={
				!hidden &&
				className.slice(0, 19) !== 'inputFactory_hidden' && [
					() => ({
						validator(rule, value) {
							if (!value) {
								if (optional) return Promise.resolve()
								else return Promise.reject('Este campo é obrigatório.')
							} else {
								return Promise.resolve()
							}
						},
					}),
				]
			}
			colon={false}
			initialValue={validateTime(inputValue)}>
			<TimePicker
				format={'HH:mm'}
				placeholder="Selecione um horário"
				style={{ width: '39.2%' }}
				disabled={disabled}
				onChange={onChange}
				minuteStep={minute_step ? minute_step : undefined}
			/>
		</Form.Item>
	)
}

TimeField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([object, string]),
		type: string.isRequired,
		info: string,
	}).isRequired,
	className: string,
	onChange: func,
	listIndex: number,
	inputValue: string,
	disabled: bool,
}

TimeField.defaultProps = {
	className: '',
	onChange: () => null,
}

export default TimeField
