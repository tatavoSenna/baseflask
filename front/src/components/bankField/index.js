import React from 'react'
import { string, shape, object, func, number } from 'prop-types'
import { Form, Select } from 'antd'
import bank from './bankName'
import InfoField from '~/components/infoField'

const BankField = ({ pageFieldsData, className, onChange, listIndex }) => {
	const { label, variable, type, id, info } = pageFieldsData
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
			hasFeedback
			className={className}
			rules={
				!hidden && [{ required: true, message: 'Este campo é obrigatório.' }]
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
		variable: object.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
	listIndex: number,
}

BankField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default BankField
