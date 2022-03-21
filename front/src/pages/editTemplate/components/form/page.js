import React from 'react'
import { useDispatch } from 'react-redux'
import { object, array, number, func } from 'prop-types'
import { Card, Form, Input, Button, Dropdown, Menu, Empty } from 'antd'
import { PlusOutlined, DownOutlined } from '@ant-design/icons'
import Delete from '~/components/deleteConfirm'
import {
	editTemplateFieldAdd,
	editTemplateFormInfo,
} from '~/states/modules/editTemplate'
import JSONField from './fields/jsonField'
import TextField from './fields/textField'
import { CurrencyField } from './fields/currencyField'

const Page = ({ pageIndex, data, variables, handleRemovePage }) => {
	const dispatch = useDispatch()

	const fieldTypes = (
		<Menu onClick={(value) => handleAddField(value.key)}>
			<Menu.Item key="text">Texto</Menu.Item>
			<Menu.Item key="text_area">Parágrafo</Menu.Item>
			<Menu.Item key="number">Número</Menu.Item>
			<Menu.Item key="cpf">CPF</Menu.Item>
			<Menu.Item key="cnpj">CNPJ</Menu.Item>
			<Menu.Item key="email">Email</Menu.Item>
			<Menu.Item key="date">Data</Menu.Item>
			<Menu.Item key="currency">Moeda</Menu.Item>
			<Menu.Item key="bank">Banco</Menu.Item>
			<Menu.Item key="state">Estado</Menu.Item>
			<Menu.Item key="city">Cidade</Menu.Item>
			<Menu.Item key="cnae">CNAE</Menu.Item>
			<Menu.Item key="dropdown">Dropdown</Menu.Item>
			<Menu.Item key="radio">Rádio</Menu.Item>
			<Menu.Item key="checkbox">Checkbox</Menu.Item>
			<Menu.Item key="slider">Slider</Menu.Item>
			<Menu.Item key="variable_file">Upload de arquivo</Menu.Item>
			<Menu.Item key="variable_image">Upload de imagem</Menu.Item>
			<Menu.Item key="database">Base de dados</Menu.Item>
			<Menu.Item key="person">Pessoa</Menu.Item>
			<Menu.Item key="address">Endereço</Menu.Item>
			<Menu.Item key="structured_list">Lista Estruturada</Menu.Item>
			<Menu.Item key="structured_checkbox">Checkbox Estruturado</Menu.Item>
			<Menu.Item key="separator">Separador</Menu.Item>
		</Menu>
	)

	const handleAddField = (type) => {
		let newField = {
			type: `${type}`,
			label: '',
			info: '',
			variable: {
				name: '',
			},
			initialValue: '',
		}

		switch (type) {
			case 'number':
				newField.variable.type = 'number'
				newField.variable.doc_display_style = 'plain | extended | ordinal'
				newField.decimals = ''
				newField.min = ''
				newField.max = ''
				newField.step = ''
				break
			case 'date':
				newField.variable.type = 'date'
				newField.variable.doc_display_style = '%d/%m/%Y | extended'
				break
			case 'checkbox':
				newField.variable.type = 'list'
				newField.variable.doc_display_style = 'commas | bullets'
				break
			case 'currency':
				newField.initialValue = 0
				newField.variable.type = 'currency'
				newField.variable.doc_display_style = 'plain | extended'
				break
			case 'slider':
				newField.options = ['min', 'max']
				break
			case 'database':
				newField.variable.type = 'database'
				newField.variable.database_endpoint = ''
				newField.variable.search_key = ''
				break
			case 'variable_file':
				newField.variable.type = 'variable_file'
				newField.variable.doc_display_style = 'plain'
				break
			case 'variable_image':
				newField.variable.type = 'variable_image'
				newField.variable.doc_display_style = 'image'
				newField.variable.width = 8.0
				break
			case 'person':
				newField.variable.type = 'person'
				newField.label = 'Autor'
				newField.info = 'Parte autora'
				newField.person_type = ['legal_person', 'natural_person']
				newField.fields = [
					'cpf',
					'pronoun',
					'name',
					'cnpj',
					'society_name',
					'country',
					'cep',
					'number',
					'street',
					'complement',
					'city',
					'state',
				]
				newField.variable.doc_display_style = 'plain'
				newField.variable.row_template = ''
				break
			case 'address':
				newField.variable.type = 'address'
				newField.label = 'Endereço'
				newField.fields = [
					'country',
					'cep',
					'number',
					'street',
					'complement',
					'city',
					'state',
				]
				newField.variable.doc_display_style = 'plain'
				newField.variable.row_template = ''
				break
			case 'structured_list':
				newField.variable.type = type
				newField.variable.doc_display_style = 'text'
				newField.variable.extra_style_params = {
					row_template: '',
					separator: '',
				}
				newField.structure = [
					{
						type: 'text',
						label: '',
						info: '',
						variable: {
							name: '',
							type: '',
							doc_display_style: '',
						},
					},
				]
				break
			case 'structured_checkbox':
				newField.variable.type = type
				newField.variable.doc_display_style = 'text'
				newField.variable.extra_style_params = {
					row_template: '',
					separator: '',
				}
				newField.structure = [
					{
						type: 'text',
						label: '',
						info: '',
						variable: {
							name: '',
							type: '',
							doc_display_style: '',
						},
					},
				]
				break
			case 'separator':
				newField = {
					type: 'separator',
					title: '',
				}
				break
			case 'text':
				newField.placeholder = ''
				newField.variable.type = 'string'
				newField.variable.doc_display_style =
					'plain | sentence_case | uppercase | lowercase'
				break
			case 'text_area':
				newField.placeholder = ''
				newField.variable.type = 'string'
				newField.variable.doc_display_style =
					'plain | sentence_case | uppercase | lowercase'
				break
			default:
				newField.variable.type = 'string'
				newField.variable.doc_display_style =
					'plain | sentence_case | uppercase | lowercase'
				break
		}

		const hasOptions = ['dropdown', 'radio', 'checkbox', 'structured_checkbox']
		if (hasOptions.includes(type)) {
			newField.options = [
				{ label: '', value: '' },
				{ label: '', value: '' },
				{ label: '', value: '' },
			]
		}

		dispatch(editTemplateFieldAdd({ newField, pageIndex }))
	}

	const updateFormInfo = (value, name, pageIndex, fieldIndex) => {
		dispatch(editTemplateFormInfo({ value, name, pageIndex, fieldIndex }))
	}

	return (
		<Card
			style={{
				marginBottom: '1rem',
				marginTop: '2rem',
				maxWidth: '40rem',
				boxShadow: '0 1px 4px 0 rgba(192, 208, 230, 0.8)',
				borderRadius: '5px',
			}}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '24px',
				}}>
				<Form.Item
					name={`title_${pageIndex}`}
					label="Título"
					style={{ width: '50%', margin: '0 0 0 8px' }}
					onChange={(e) => updateFormInfo(e.target.value, 'title', pageIndex)}
					rules={[{ required: true, message: 'Este campo é obrigatório.' }]}>
					<Input autoFocus value={data.title} />
				</Form.Item>
				<Delete
					title="Deseja excluir esse esse conjunto de campos?"
					handle={() => handleRemovePage(pageIndex)}
				/>
			</div>
			{!data.fields.length ? (
				<Empty description="Sem Campos" style={{ marginBottom: '1rem' }} />
			) : (
				data.fields.map((field, fieldIndex) => {
					let key = data.ids[fieldIndex]

					if (field?.type === 'text') {
						return (
							<TextField
								key={key}
								data={field}
								variables={variables}
								pageIndex={pageIndex}
								fieldIndex={fieldIndex}
								updateFormInfo={updateFormInfo}
							/>
						)
					} else if (field?.type === 'currency') {
						return (
							<CurrencyField
								key={key}
								data={field}
								variables={variables}
								pageIndex={pageIndex}
								fieldIndex={fieldIndex}
								updateFormInfo={updateFormInfo}
							/>
						)
					} else {
						return (
							<JSONField
								key={key}
								data={field}
								variables={variables}
								pageIndex={pageIndex}
								fieldIndex={fieldIndex}
								updateFormInfo={updateFormInfo}
							/>
						)
					}
				})
			)}
			<Dropdown overlay={fieldTypes} trigger="click">
				<Button
					type="primary"
					icon={<PlusOutlined />}
					style={{
						display: 'inline-block',
						float: 'right',
					}}>
					Novo Campo
					<DownOutlined />
				</Button>
			</Dropdown>
		</Card>
	)
}

export default Page

Page.propTypes = {
	data: object,
	variables: array,
	pageIndex: number,
	handleRemovePage: func,
}
