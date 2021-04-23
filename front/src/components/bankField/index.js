import React from 'react'
import { string, shape, object, func } from 'prop-types'
import { Form, Select } from 'antd'
import bank from './bankName'
import InfoField from '~/components/infoField'

const BankField = ({ pageFieldsData, className, onChange }) => {
	const { label, variable, type, id, info } = pageFieldsData
	const isObj = typeof variable === 'object'
	return (
		<Form.Item
			key={`${isObj ? variable.name : variable}_${id}`}
			name={isObj ? variable.name : variable}
			label={<InfoField label={label} info={info} />}
			hasFeedback
			className={className}
			rules={
				typeof className === 'string' &&
				className.slice(0, 19) !== 'inputFactory_hidden' && [
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
		variable: object.isRequired,
		type: string.isRequired,
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
}

BankField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default BankField
