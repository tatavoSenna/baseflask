import React, { useState } from 'react'
import PropTypes, {
	string,
	shape,
	object,
	func,
	number,
	array,
} from 'prop-types'
import { Form, Radio, Card } from 'antd'
import InfoField from '~/components/infoField'
import LegalPerson from './legal'
import NaturalPerson from './natural'

const PersonField = ({
	pageFieldsData,
	className,
	onChange,
	pageIndex,
	fieldIndex,
}) => {
	const { label, variable, type, fields, id, info, person_type } =
		pageFieldsData
	const fixedPerson = person_type === 'legal' ? 'Jurídica' : 'Física'
	const objName = `person_${pageIndex}_${fieldIndex}`
	const isObj = typeof variable === 'object'
	const varname = isObj ? variable.name : variable
	const name = id !== undefined ? `${varname}_${id}` : varname
	const [person, setPerson] = useState(fixedPerson)
	return (
		<Form.Item
			key={name}
			label={<InfoField label={label} info={info} />}
			type={type}
			className={className}
			onChange={onChange}
			hasFeedback
			colon={false}>
			<Card bodyStyle={{ paddingBottom: 0 }}>
				{person_type === undefined && (
					<Form.Item
						name={[objName, 'PERSON_TYPE']}
						initialValue="Física"
						style={{ marginBottom: 5 }}>
						<Radio.Group
							onChange={(value) => setPerson(value.target.value)}
							style={{ marginBottom: '24px' }}>
							<Radio.Button value="Física">Física</Radio.Button>
							<Radio.Button value="Jurídica">Jurídica</Radio.Button>
						</Radio.Group>
					</Form.Item>
				)}
				{person === 'Física' ? (
					<NaturalPerson fields={fields} name={objName} />
				) : (
					<LegalPerson fields={fields} name={objName} />
				)}
			</Card>
		</Form.Item>
	)
}

PersonField.propTypes = {
	pageFieldsData: shape({
		label: string.isRequired,
		variable: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		fields: array,
		type: string.isRequired,
		info: string,
	}).isRequired,
	className: object,
	onChange: func,
	pageIndex: number,
	fieldIndex: number,
}

PersonField.defaultProps = {
	className: {},
	onChange: () => null,
}

export default PersonField
