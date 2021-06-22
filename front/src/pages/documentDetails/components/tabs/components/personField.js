import React from 'react'
import { object, bool } from 'prop-types'
import { Form, Typography } from 'antd'
import NaturalPerson from '~/components/personField/natural'
import LegalPerson from '~/components/personField/legal'

const { Title } = Typography

const PersonField = ({ item, disabled }) => {
	return (
		<>
			<Title
				level={4}
				style={{ marginTop: 10, marginBottom: '24px', fontSize: 15 }}>
				{item.subtitle}
			</Title>
			{item.person_type === 'Física' ? (
				<NaturalPerson
					fields={item.items}
					name={item.struct_name}
					disabled={disabled}
				/>
			) : (
				<LegalPerson
					fields={item.items}
					name={item.struct_name}
					disabled={disabled}
				/>
			)}
			<Form.Item
				name={[item.struct_name, 'PERSON_TYPE']}
				initialValue={item.person_type}
			/>
		</>
	)
}

PersonField.propTypes = {
	item: object,
	disabled: bool,
}

export default PersonField
