import React from 'react'
import { array, func, number } from 'prop-types'
import { Card, Badge, Divider } from 'antd'
import Delete from '~/components/deleteConfirm'
import RadioField from '~/components/radioField'
import CnpjField from '~/components/cnpjField'
import CpfField from '~/components/cpfField'
import EmailField from '~/components/emailField'
import CurrencyField from '~/components/currencyField'
import TextField from '~/components/textField'
import DropdownField from '~/components/dropdownField'
import DateField from '~/components/dateField'
import StateField from '~/components/stateField'
import CnaeField from '~/components/cnaeField'
import CityField from '~/components/cityField'
import CheckboxField from '~/components/checkboxField'
import SliderField from '~/components/sliderField'
import BankField from '~/components/bankField'
import FileField from '~/components/fileField'
import TimeField from '~/components/timeField'
import TextAreaField from '~/components/textAreaField'

const StructuredVariable = ({ name, fieldKey, remove, structure }) => {
	return (
		<Card key={fieldKey} style={{ marginBottom: '20px' }}>
			{structure.map((pageFieldsData, i) => {
				switch (pageFieldsData.type) {
					case 'radio':
						return (
							<RadioField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)
					case 'cnpj':
						return (
							<CnpjField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
								first={i === 0}
							/>
						)
					case 'cpf':
						return (
							<CpfField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
								first={i === 0}
							/>
						)
					case 'email':
						return (
							<EmailField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
								first={i === 0}
							/>
						)
					case 'currency':
						return (
							<CurrencyField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)
					case 'dropdown':
						return (
							<DropdownField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)
					case 'date':
						return (
							<DateField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)
					case 'time':
						return (
							<TimeField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)
					case 'state':
						return (
							<StateField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)
					case 'checkbox':
						return (
							<CheckboxField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)
					case 'cnae':
						return (
							<CnaeField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)
					case 'city':
						return <CityField key={i} pageFieldsData={pageFieldsData} />
					case 'slider':
						return (
							<SliderField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)
					case 'bank':
						return (
							<BankField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)

					case 'variable_file':
						return (
							<FileField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)
					case 'text_area':
						return (
							<TextAreaField
								key={i}
								listIndex={name}
								pageFieldsData={pageFieldsData}
							/>
						)
					default:
						return (
							<TextField
								key={`${name}_${i}`}
								listIndex={name}
								pageFieldsData={pageFieldsData}
								first={i === 0}
							/>
						)
				}
			})}

			<div
				style={{
					display: 'flex',
					background: 'rgba(230, 236, 245, 0.5)',
					height: '40px',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					margin: '25px -25px -25px -25px',
				}}>
				<Badge count={name + 1} style={{ background: '#1890ff' }} />
				<Divider
					type="vertical"
					style={{
						height: '20px',
						borderLeft: '1px solid #bdbdbd',
						marginTop: '2px',
					}}
				/>
				<Delete
					handle={() => remove(name)}
					title="Deseja excluir esse campo?"
				/>
			</div>
		</Card>
	)
}

export default StructuredVariable

StructuredVariable.propTypes = {
	name: number,
	fieldKey: number,
	remove: func,
	structure: array,
}
