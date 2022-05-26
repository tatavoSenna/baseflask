import React from 'react'
import { string, shape, object, func, bool } from 'prop-types'
import { Form, Select } from 'antd'
import bank from './bankName'
import InfoField from '~/components/infoField'
import { filterText } from '~/services/filter'

const BankField = ({
	pageFieldsData,
	className,
	onChange,
	inputValue,
	disabled,
	visible,
}) => {
	const { label, variable, type, id, info, list, optional } = pageFieldsData
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	return (
		<Form.Item
			key={name}
			name={list !== undefined ? [list, name] : name}
			label={<InfoField label={label} info={info} />}
			hasFeedback
			className={className}
			rules={
				visible && [
					{ required: !optional, message: 'Este campo é obrigatório.' },
				]
			}
			type={type}
			colon={false}
			initialValue={!inputValue ? '' : inputValue}>
			<Select
				showSearch={true}
				disabled={disabled}
				filterOption={filterText}
				onChange={onChange ? (v) => onChange(v) : undefined}>
				{bank.names.map((option, index) => (
					<Select.Option key={index} value={option}>
						{option}
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	)
}

BankField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: object.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
	inputValue: string,
	disabled: bool,
	visible: bool,
}

BankField.defaultProps = {
	className: {},
	onChange: () => null,
	visible: true,
}

export default BankField
