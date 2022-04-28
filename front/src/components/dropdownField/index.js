import React from 'react'
import PropTypes, {
	string,
	shape,
	array,
	object,
	func,
	bool,
	node,
} from 'prop-types'
import { Form, Select } from 'antd'
import InfoField from '~/components/infoField'
import styles from './index.module.scss'

const DropdownField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	disabled,
	notFoundContent,
}) => {
	const { label, variable, type, options, id, info, list, optional } =
		pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname
	const hidden =
		typeof className === 'string'
			? className.slice(0, 19) === 'inputFactory_hidden'
			: false

	const returnLabel = () => {
		if (label.length > 0) {
			return <InfoField label={label} info={info} />
		}
		return null
	}

	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={returnLabel()}
			hasFeedback
			className={`${className} ${styles['form-dropdown']}`}
			rules={
				!hidden && [
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}
			type={type}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<Select
				disabled={disabled}
				onChange={onChange}
				allowClear={optional ? true : false}
				notFoundContent={notFoundContent}>
				{options.map((option, index) => (
					<Select.Option key={index} value={option.value}>
						{option.label}
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	)
}

DropdownField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([object, string]).isRequired,
		type: string.isRequired,
		options: array.isRequired,
		info: string,
	}).isRequired,
	className: string,
	onChange: func,
	inputValue: string,
	notFoundContent: node,
	disabled: bool,
}

DropdownField.defaultProps = {
	onChange: () => null,
}

export default DropdownField
