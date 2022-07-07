import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { object, array, number, func } from 'prop-types'
import { Card, Form, Input, Button, Dropdown, Menu, Empty } from 'antd'
import { PlusOutlined, DownOutlined } from '@ant-design/icons'
import Delete from '~/components/deleteConfirm'
import {
	editTemplateFieldAdd,
	editTemplateFormInfo,
} from '~/states/modules/editTemplate'
import { fieldStructure } from './fieldStructure'

import { widgets } from './widgets'
import { JSONWidget } from './widgets/jsonWidget'
import {
	editTemplateFieldRemove,
	editTemplateFieldValid,
} from 'states/modules/editTemplate'

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
			<Menu.Item key="time">Hora</Menu.Item>
			<Menu.Item key="currency">Moeda</Menu.Item>
			<Menu.Item key="bank">Banco</Menu.Item>
			<Menu.Item key="cnae">CNAE</Menu.Item>
			<Menu.Item key="dropdown">Dropdown</Menu.Item>
			<Menu.Item key="radio">Rádio</Menu.Item>
			<Menu.Item key="checkbox">Checkbox</Menu.Item>
			<Menu.Item key="variable_image">Upload de imagem</Menu.Item>
			<Menu.Item key="database">API</Menu.Item>
			<Menu.Item key="internal_database">Banco de dados</Menu.Item>
			<Menu.Item key="person">Pessoa</Menu.Item>
			<Menu.Item key="address">Endereço</Menu.Item>
			<Menu.Item key="structured_list">Lista Estruturada</Menu.Item>
			<Menu.Item key="separator">Separador</Menu.Item>
		</Menu>
	)

	const handleAddField = (type) => {
		const newField = fieldStructure(type)
		dispatch(editTemplateFieldAdd({ newField, pageIndex }))
	}

	const handleUpdateTitle = useCallback(
		(value, pageIndex, fieldIndex) => {
			dispatch(
				editTemplateFormInfo({ value, name: 'title', pageIndex, fieldIndex })
			)
		},
		[dispatch]
	)

	const handleRemoveField = useCallback(
		(pageIndex, fieldIndex) => {
			dispatch(editTemplateFieldRemove({ pageIndex, fieldIndex }))
		},
		[dispatch]
	)

	const handleUpdateField = useCallback(
		(value, pageIndex, fieldIndex) => {
			dispatch(
				editTemplateFormInfo({ value, name: 'field', pageIndex, fieldIndex })
			)
		},
		[dispatch]
	)

	const handleVadidationField = useCallback(
		(value, pageIndex, fieldIndex) => {
			dispatch(editTemplateFieldValid({ value, pageIndex, fieldIndex }))
		},
		[dispatch]
	)

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
					onChange={(e) => handleUpdateTitle(e.target.value, pageIndex)}
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
					const el = field?.type in widgets ? widgets[field.type] : JSONWidget
					const props = {
						key: data.ids[fieldIndex],
						data: field,
						variables,
						pageIndex,
						fieldIndex,
						onUpdate: handleUpdateField,
						onRemove: handleRemoveField,
						onValidate: handleVadidationField,
						valid: data.valid[fieldIndex],
					}

					return React.createElement(el, props)
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
