import React from 'react'
import { object, bool } from 'prop-types'
import { Form } from 'antd'

import NaturalPerson from '~/components/personField/naturalPerson'
import LegalPerson from '~/components/personField/legalPerson'

import { DisplayNone, StyledTitle, FlexContainer } from './styles/style'

const PersonField = ({ item, disabled, form }) => {
	const { struct_name, items, person_type } = item

	const FormItems = (name, value, variable) => (
		<>
			<Form.Item name={name}>
				<></>
			</Form.Item>
			<Form.Item name={[name, variable]} initialValue={value}>
				<></>
			</Form.Item>
		</>
	)

	return (
		<>
			<StyledTitle>{item.subtitle}</StyledTitle>
			<Form.Item>
				<>
					<DisplayNone>
						{FormItems(struct_name, person_type, 'PERSON_TYPE')}
					</DisplayNone>
					{person_type === 'natural_person' && (
						<FlexContainer>
							<NaturalPerson
								fields={items}
								name={struct_name}
								disabled={disabled}
								form={form}
							/>
						</FlexContainer>
					)}
					{person_type === 'legal_person' && (
						<FlexContainer>
							<LegalPerson
								fields={items}
								name={struct_name}
								disabled={disabled}
							/>
						</FlexContainer>
					)}
				</>
			</Form.Item>
		</>
	)
}

PersonField.propTypes = {
	item: object,
	disabled: bool,
	form: object,
}

export default PersonField
