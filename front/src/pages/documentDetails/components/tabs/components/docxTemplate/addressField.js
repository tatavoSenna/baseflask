import React from 'react'
import { object, bool } from 'prop-types'
import { Form } from 'antd'

import Fields from 'components/addressField/fields'

import { DisplayNone, StyledTitle, FlexContainer } from './styles/style'

const AddressField = ({ item, disabled }) => {
	const { struct_name, items } = item

	const variableItem = items.find((i) => i.field_type === 'variable_name')

	const FormItems = (name, value, variable) => (
		<Form.Item name={[name, variable]} initialValue={value}>
			<></>
		</Form.Item>
	)

	return (
		<>
			<StyledTitle>{item.subtitle}</StyledTitle>
			<Form.Item>
				<>
					<DisplayNone>
						{FormItems(struct_name, variableItem.value, 'VARIABLE_NAME')}
					</DisplayNone>
					<FlexContainer>
						<Fields fields={items} name={struct_name} disabled={disabled} />
					</FlexContainer>
				</>
			</Form.Item>
		</>
	)
}

AddressField.propTypes = {
	item: object,
	disabled: bool,
}

export default AddressField
