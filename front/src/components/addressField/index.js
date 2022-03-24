import React from 'react'
import styled from 'styled-components'

import PropTypes, {
	string,
	shape,
	array,
	number,
	bool,
	object,
	func,
} from 'prop-types'
import { Form, Typography } from 'antd'
import Fields from './fields'

const { Title } = Typography

const AddressField = ({
	pageFieldsData,
	className,
	pageIndex,
	disabled,
	inputValue,
	fieldIndex,
	onChange,
}) => {
	const { label, variable, type, fields, id } = pageFieldsData

	const objName = `address_${pageIndex}_${fieldIndex}`
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.type : variable
	const name = id !== undefined ? `${varname}_${id}` : varname

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
				<Form.Item
					name={[objName, 'VARIABLE_NAME']}
					initialValue={variable.name}>
					<></>
				</Form.Item>
			</DisplayNone>
			<Lebal>{label}</Lebal>
			<AddressContainer>
				<Fields
					fields={fields}
					name={objName}
					disabled={disabled}
					onChange={onChange}
					inputValue={inputValue}
				/>
			</AddressContainer>
		</Form.Item>
	)
}

AddressField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([object, string]),
		fields: array,
		type: string.isRequired,
	}).isRequired,
	className: PropTypes.oneOfType([object, string]),
	pageIndex: number,
	fieldIndex: number,
	disabled: bool,
	inputValue: string,
	onChange: func,
}

AddressField.defaultProps = {
	className: {},
	onChange: () => null,
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
