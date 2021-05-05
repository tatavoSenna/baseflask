import React from 'react'
import { useDispatch } from 'react-redux'
import { object, number, func } from 'prop-types'
import { Card, Form, Input, Button, Dropdown, Menu, Empty } from 'antd'
import { PlusOutlined, DownOutlined } from '@ant-design/icons'
import Delete from '~/components/deleteConfirm'
import {
	postTemplateFieldAdd,
	postTemplateFormInfo,
} from '~/states/modules/postTemplate'
import Field from './field'

const Page = ({ pageIndex, data, handleRemovePage }) => {
	const dispatch = useDispatch()

	const fieldTypes = (
		<Menu onClick={(value) => handleAddField(value.key)}>
			<Menu.Item key="text">Texto</Menu.Item>
			<Menu.Item key="text_area">Área de texto</Menu.Item>
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
			<Menu.Item key="text_area">Área de texto</Menu.Item>
			<Menu.Item key="structured_list">Lista Estruturada</Menu.Item>
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
		}

		switch (type) {
			case 'date':
				newField.variable.type = 'date'
				newField.variable.doc_display_style = '%d%m%Y'
				break
			case 'checkbox':
				newField.variable.type = 'list'
				newField.variable.doc_display_style = 'commas | bullets'
				break
			case 'currency':
				newField.variable.type = 'currency'
				newField.variable.doc_display_style = 'plain | currency_extended'
				break
			case 'slider':
				newField.options = ['min', 'max']
				break
			case 'database':
				newField.variable.type = 'database'
				newField.variable.database_name = ''
				break
			case 'variable_file':
				newField.variable.type = 'variable_file'
				newField.variable.doc_display_style = 'plain'
				break
			case 'variable_image':
				newField.variable.type = 'variable_image'
				newField.variable.doc_display_style = 'image'
				break
			default:
				newField.variable.type = 'string'
				newField.variable.doc_display_style =
					'plain | sentence_case | uppercase | lowercase'
				break
		}

		const hasOptions = ['dropdown', 'radio', 'checkbox']
		if (hasOptions.includes(type)) {
			newField.options = [
				{ label: '', value: '' },
				{ label: '', value: '' },
				{ label: '', value: '' },
			]
		}

		dispatch(postTemplateFieldAdd({ newField, pageIndex }))
	}

	const updateFormInfo = (value, name, pageIndex, fieldIndex) => {
		dispatch(postTemplateFormInfo({ value, name, pageIndex, fieldIndex }))
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
				data.fields.map((field, fieldIndex) => (
					<Field
						key={fieldIndex}
						data={field}
						pageIndex={pageIndex}
						fieldIndex={fieldIndex}
						updateFormInfo={updateFormInfo}
					/>
				))
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
	pageIndex: number,
	handleRemovePage: func,
}
