import React from 'react'
import { object, bool } from 'prop-types'
import { Form } from 'antd'

import Fields from 'components/addressField/fields'

import { DisplayNone, StyledTitle, FlexContainer } from './styles/style'

const AddressField = ({ item, disabled }) => {
	const { struct_name, items } = item

	const FormItems = (name) => (
		<Form.Item name={name}>
			<></>
		</Form.Item>
	)

	return (
		<>
			<StyledTitle>{item.subtitle}</StyledTitle>
			<Form.Item>
				<>
					<DisplayNone>{FormItems(struct_name)}</DisplayNone>
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
