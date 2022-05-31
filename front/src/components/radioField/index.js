import React from 'react'
import PropTypes, { string, shape, array, object, func, bool } from 'prop-types'
import InfoField from '~/components/infoField'

import { Form, Radio, Space } from 'antd'
import { InfoOptionalField } from 'components/infoField'
import styles from './index.module.scss'

const RadioField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	disabled,
	visible,
	form,
}) => {
	const { label, variable, type, options, id, info, list, optional } =
		pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const returnLabel = () => {
		if (optional && label.length > 0) {
			return <InfoOptionalField label={label} info={info} onClick={clearAll} />
		}
		if (label.length > 0) {
			return <InfoField label={label} info={info} />
		}
		return null
	}

	const clearAll = () => {
		if (form !== undefined) {
			form.setFieldsValue({ [name]: '' })
		}
	}
	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={returnLabel()}
			className={`${className} ${styles['form-radio']}`}
			hasFeedback
			rules={
				visible && [
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}
			type={type}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<Radio.Group disabled={disabled}>
				<Space direction="vertical" size={12}>
					{options.map((option, index) => (
						<Radio key={index} value={option.value} onChange={onChange}>
							{option.label}
						</Radio>
					))}
				</Space>
			</Radio.Group>
		</Form.Item>
	)
}

RadioField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([object, string]).isRequired,
		type: string.isRequired,
		options: array.isRequired,
		info: string,
	}).isRequired,
	form: object,
	className: string,
	onChange: func,
	inputValue: string,
	disabled: bool,
	visible: bool,
}

RadioField.defaultProps = {
	onChange: () => null,
	visible: true,
}

export default RadioField
