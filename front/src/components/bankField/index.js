import React from 'react'
import { string, shape, object, func } from 'prop-types'
import { Form, Select } from 'antd'
import bank from './bankName'

const BankField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, type, id } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={label}
			hasFeedback
			className={className}
			rules={
				className !== 'inputFactory_hidden__18I0s' && [
					{ required: true, message: 'Este campo é obrigatório.' },
				]
			}
			type={type}
			colon={false}>
			<Select showSearch={true}>
				{bank.names.map((option, index) => (
					<Select.Option key={index} value={option} onChange={onChange}>
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
		variable: string.isRequired,
		type: string.isRequired,
	}).isRequired,
	className: object,
	onChange: func,
}

BankField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default BankField
