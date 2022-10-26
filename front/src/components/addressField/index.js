import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import PropTypes, { string, shape, array, bool, object, func } from 'prop-types'
import { Form, Spin, Typography } from 'antd'
import Fields from './fields'

const { Title } = Typography

const AddressField = ({
	pageFieldsData,
	className,
	disabled,
	visible,
	inputValue,
	onChange,
	form,
	first,
}) => {
	const { label, variable, type, fields, id, optional } = pageFieldsData
	const _addressValue = inputValue !== undefined ? inputValue : {}

	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.type : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

	const [loading, setLoading] = useState(false)

	const getLoading = useCallback(
		(isLoading) => {
			setLoading(isLoading)
		},
		[setLoading]
	)

	return (
		<Form.Item
			label={null}
			key={name}
			type={type}
			className={className}
			hasFeedback
			colon={false}
			style={{ marginBottom: 0 }}>
			<DisplayNone>
				<Form.Item name={variable.name}>
					<></>
				</Form.Item>
			</DisplayNone>
			<Lebal>{label}</Lebal>
			<Spin spinning={loading} tip="Carregando dados">
				<AddressContainer>
					<Fields
						fields={fields}
						name={variable.name}
						disabled={disabled}
						visible={visible}
						optional={optional}
						onChange={onChange}
						inputValue={_addressValue}
						form={form}
						first={first}
						getLoading={getLoading}
					/>
				</AddressContainer>
			</Spin>
		</Form.Item>
	)
}

AddressField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([object, string]),
		fields: array,
		type: string.isRequired,
		optional: bool,
	}).isRequired,
	className: string,
	disabled: bool,
	visible: bool,
	form: object,
	inputValue: object,
	onChange: func,
	first: bool,
}

AddressField.defaultProps = {
	className: {},
	onChange: () => null,
	visible: true,
}

export default AddressField

const AddressContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	column-gap: 12px;

	@media (max-width: 600px) {
		flex-direction: column;
		> * {
			flex: 1 0 100%;
		}
	}
`

const DisplayNone = styled.div`
	display: none;
`

const Lebal = styled(Title)`
	margin: 10px 0 24px !important;
	font-size: 18px !important;
	font-weight: 500;
`
