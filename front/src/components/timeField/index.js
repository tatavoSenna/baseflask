import React from 'react'
import { string, shape, func, object, number, bool } from 'prop-types'
import { Form } from 'antd'
import { validateTime } from '../../utils'
import MaskedInput from 'antd-mask-input'
import InfoField from '~/components/infoField'

const TimeField = ({
	pageFieldsData,
	className,
	onChange,
	listIndex,
	inputValue,
	disabled,
}) => {
	const { label, variable, id, info } = pageFieldsData
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
			className={className}
			hasFeedback
			rules={
				!hidden &&
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
			colon={false}
			initialValue={!inputValue ? '' : inputValue}
		>
			<MaskedInput
				mask="11:11"
				placeholder=""
				style={{ width: '39.2%' }}
				disabled={disabled}
				onChange={onChange}
			/>
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
	listIndex: number,
	inputValue: string,
	disabled: bool,
}

TimeField.defaultProps = {
	className: '',
	onChange: () => null,
}

export default TimeField
