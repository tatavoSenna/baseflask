import React from 'react'
import { object } from 'prop-types'
import { Divider, Typography } from 'antd'

import DefaultText from './components/defaultText'
import DateFieldText from './components/dateFieldText'
import AddressFieldText from './components/addressFieldText'
import PersonFieldText from './components/personFieldText'
import CheckBoxFieldText from './components/checkboxFieldText'
import DatabaseFieldText from './components/databaseFieldText'
import StructureListFieldText from './components/structureListFieldText'
import ImageFieldText from './components/imageFieldText'
import CurrencyFieldText from './components/currencyFieldText'

import { ContainerTabs, ScrollContent } from '../styles'

const { Title } = Typography

const makeVariableName = (field) => {
	switch (field.type) {
		case 'variable_image':
			return `image_${field.variable.name}`
		default:
			return field.variable.name
	}
}

const makePageDisplay = (formQuestionsPage, formAnswerVariables) => {
	const displayFields = []
	formQuestionsPage.fields.forEach(function (field) {
		if ('variable' in field && makeVariableName(field) in formAnswerVariables) {
			const fieldData = {
				field,
				value: formAnswerVariables[makeVariableName(field)],
			}
			displayFields.push(fieldData)
		}
	})
	return {
		title: formQuestionsPage.title,
		fields: displayFields,
	}
}

const InfoView = ({ infos }) => {
	let formDisplay = []
	infos.form.forEach((page) => {
		page = makePageDisplay(page, infos.variables)
		if (page.fields.length > 0) {
			formDisplay.push(page)
		}
	})

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
								case 'structured_list':
									return <StructureListFieldText key={i} data={fieldData} />
								case 'checkbox':
									return <CheckBoxFieldText key={i} data={fieldData} />
								case 'variable_image':
									return <ImageFieldText key={i} data={fieldData} />
								case 'internal_database':
									return <DatabaseFieldText key={i} data={fieldData} />
								case 'currency':
									return <CurrencyFieldText key={i} data={fieldData} />
								default:
									return <DefaultText key={i} data={fieldData} />
							}
						})}
						{formDisplay.length - 1 !== index && <Divider />}
					</ContainerTabs>
				</div>
			))}
		</ScrollContent>
	)
}

export default InfoView

InfoView.propTypes = {
	infos: object,
}
