import React from 'react'
import { Button, Divider, Typography } from 'antd'

import AddressFieldText from './components/addressFieldText'
import DateFieldText from './components/dateFieldText'
import PersonFieldText from './components/personFieldText'
import { StyledLabel, StyledValue } from './components/styles/style'

import { useHistory, useParams } from 'react-router-dom'

import { ContainerTabs, ScrollContent } from '../styles'
import { object, string } from 'prop-types'
import StructureListFieldText from './components/structureListFieldText'
import CheckBoxFieldText from './components/checkboxFieldText'
import DatabaseFieldText from './components/databaseFieldText'

const { Title } = Typography

const InfoView = ({ infos, textType }) => {
	const history = useHistory()
	const { id } = useParams()

	let form = []

	for (let i = 0; i < infos.form.length; i++) {
		let page = infos.form[i]
		let fields = []
		for (let j = 0; j < page.fields.length; j++) {
			let f = infos.form[i].fields[j]
			if (
				f.variable?.name !== undefined &&
				f.variable.name in infos.variables
			) {
				fields.push(f)
			}
		}

		if (fields.length > 0) form.push({ fields, title: page.title })
	}

	const handleEdit = () => {
		return history.push({
			pathname: `/documents/${id}/edit`,
			state: { current: 0 },
		})
	}

	const defaultView = (item, index) => {
		const label = item.label || item?.variable?.name
		return (
			<div key={index}>
				{label && <StyledLabel>{label}:</StyledLabel>}
				<StyledValue>{item.initialValue}</StyledValue>
			</div>
		)
	}

	const textView = (item) =>
		item.fields?.map((item, index) => {
			switch (item.type) {
				case 'address':
					return <AddressFieldText data={item} key={item.type + index} />
				case 'person':
					return <PersonFieldText data={item} key={item.type + index} />
				case 'date':
					return <DateFieldText data={item} key={item.type + index} />
				case 'structured_list':
					return <StructureListFieldText data={item} key={item.type + index} />
				case 'checkbox':
					return <CheckBoxFieldText data={item} key={item.type + index} />
				case 'variable_image':
					return null
				case 'internal_database':
					return <DatabaseFieldText data={item} key={item.type + index} />
				default:
					return defaultView(item, item.type + index)
			}
		})

	const buttonEditForm = () => {
		return <Button onClick={handleEdit}>Editar</Button>
	}

	return (
		<ScrollContent>
			{form.map((item, index) => (
				<div key={index}>
					<ContainerTabs key={index}>
						<Title
							key={index}
							level={4}
							style={{ marginTop: 20, fontSize: 18 }}>
							{item.title}
						</Title>
						{textView(item)}

						{form.length - 1 !== index && <Divider />}
					</ContainerTabs>
				</div>
			))}
			{textType === '.docx' && buttonEditForm()}
		</ScrollContent>
	)
}

export default InfoView

InfoView.propTypes = {
	infos: object,
	textType: string,
}
