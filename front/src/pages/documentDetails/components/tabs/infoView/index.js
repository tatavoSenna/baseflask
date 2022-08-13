import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { object, string, bool } from 'prop-types'
import { Button, Divider, Typography } from 'antd'

import DefaultText from './components/defaultText'
import DateFieldText from './components/dateFieldText'
import AddressFieldText from './components/addressFieldText'
import PersonFieldText from './components/personFieldText'
import CheckBoxFieldText from './components/checkboxFieldText'
import DatabaseFieldText from './components/databaseFieldText'
import StructureListFieldText from './components/structureListFieldText'
import ImageFieldText from './components/imageFieldText'

import { ContainerTabs, ScrollContent } from '../styles'

const { Title } = Typography

const InfoView = ({ infos, textType, cantItChangeVariablesValues }) => {
	const history = useHistory()
	const { id } = useParams()

	let form = []

	for (let i = 0; i < infos.form.length; i++) {
		let page = infos.form[i]

		let fields = page.fields.reduce((a, field) => {
			if (field.variable?.name !== undefined && field.initialValue) {
				return [...a, field]
			} else {
				return a
			}
		}, [])

		if (fields.length > 0) form.push({ fields, title: page.title })
	}

	const handleEdit = () => {
		return history.push({
			pathname: `/documents/${id}/edit`,
			state: { current: 0 },
		})
	}

	const textView = (item) =>
		item.fields?.map((item, index) => {
			const props = {
				data: item,
				key: item.type + index,
			}

			switch (item.type) {
				case 'address':
					return <AddressFieldText {...props} />
				case 'person':
					return <PersonFieldText {...props} />
				case 'date':
					return <DateFieldText {...props} />
				case 'structured_list':
					return <StructureListFieldText {...props} />
				case 'checkbox':
					return <CheckBoxFieldText {...props} />
				case 'variable_image':
					return <ImageFieldText {...props} />
				case 'internal_database':
					return <DatabaseFieldText {...props} />
				default:
					return <DefaultText {...props} />
			}
		})

	const buttonEditForm = () => {
		return (
			<Button onClick={handleEdit} disabled={infos.sent}>
				Editar
			</Button>
		)
	}

	return (
		<ScrollContent>
			{form.map((page, index) => (
				<div key={index}>
					<ContainerTabs key={index}>
						<Title
							key={index}
							level={4}
							style={{ marginTop: 20, fontSize: 18 }}>
							{page.title}
						</Title>
						{textView(page)}

						{form.length - 1 !== index && <Divider />}
					</ContainerTabs>
				</div>
			))}
			{(textType === '.docx' || cantItChangeVariablesValues) &&
				buttonEditForm()}
		</ScrollContent>
	)
}

export default InfoView

InfoView.propTypes = {
	infos: object,
	textType: string,
	cantItChangeVariablesValues: bool,
}
