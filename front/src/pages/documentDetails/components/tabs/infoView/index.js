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

const makeVariableName = (pageIndex, fieldIndex, field) => {
	switch (field.type) {
		case 'variable_image':
			return `image_${field.variable.name}`
		case 'structured_list':
			return `structured_list_${pageIndex}_${fieldIndex}`
		default:
			return field.variable.name
	}
}

const makePageDisplay = (pageIndex, formQuestionsPage, formAnswerVariables) => {
	const displayFields = []
	formQuestionsPage.fields.forEach(function (field, fieldIndex) {
		if (
			'variable' in field &&
			makeVariableName(pageIndex, fieldIndex, field) in formAnswerVariables
		) {
			const fieldData = {
				field,
				value:
					formAnswerVariables[makeVariableName(pageIndex, fieldIndex, field)],
			}
			displayFields.push(fieldData)
		}
	})
	return {
		title: formQuestionsPage.title,
		fields: displayFields,
	}
}

const InfoView = ({ infos, textType, cantItChangeVariablesValues }) => {
	console.log(infos)
	const history = useHistory()
	const { id } = useParams()

	let formDisplay = []
	infos.form.forEach((page, pageIndex) => {
		page = makePageDisplay(pageIndex, page, infos.variables)
		if (page.fields.length > 0) {
			formDisplay.push(page)
		}
	})

	const handleEdit = () => {
		return history.push({
			pathname: `/documents/${id}/edit`,
			state: { current: 0 },
		})
	}

	const buttonEditForm = () => {
		return (
			<Button onClick={handleEdit} disabled={infos.sent}>
				Editar
			</Button>
		)
	}

	return (
		<ScrollContent>
			{formDisplay.map((formPage, index) => (
				<div key={index}>
					<ContainerTabs key={index}>
						<Title
							key={index}
							level={4}
							style={{ marginTop: 20, fontSize: 18 }}>
							{formPage.title}
						</Title>
						{formPage.fields.map((fieldData, i) => {
							switch (fieldData.field.type) {
								case 'address':
									return <AddressFieldText key={i} data={fieldData} />
								case 'person':
									return <PersonFieldText key={i} data={fieldData} />
								case 'date':
									return <DateFieldText key={i} data={fieldData} />
								// case 'structured_list':
								// 	return <StructureListFieldText key={i} data={fieldData} />
								case 'checkbox':
									return <CheckBoxFieldText key={i} data={fieldData} />
								case 'variable_image':
									return <ImageFieldText key={i} data={fieldData} />
								case 'internal_database':
									return <DatabaseFieldText key={i} data={fieldData} />
								default:
									return <DefaultText key={i} data={fieldData} />
							}
						})}
						{formDisplay.length - 1 !== index && <Divider />}
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
