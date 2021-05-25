import React from 'react'
import { Button, Space, Switch } from 'antd'

import Delete from '~/components/deleteConfirm'

export const getColumns = (
	handleToGo,
	handlePublishTemplate,
	handleDeleteTemplate
) => [
	{
		title: 'Publicado',
		dataIndex: 'published',
		key: 'published',
		render: (published, row) => {
			return (
				<Switch
					checked={published}
					onChange={() => handlePublishTemplate(row, !published)}
				/>
			)
		},
	},
	{
		title: 'Descrição',
		dataIndex: 'name',
		key: 'name',
		render: (text, row) => (
			<Button type="link" onClick={() => handleToGo(row)}>
				{text}
			</Button>
		),
	},
	{
		title: 'Criado por',
		dataIndex: 'authorEmail',
		key: 'authorEmail',
	},
	{
		title: 'Data Criação',
		dataIndex: 'createdAt',
		key: 'createdAt',
	},
	{
		title: '',
		dataIndex: 'action',
		key: 'action',
		render: (row) => (
			<Space size="middle">
				<Delete
					title="Deseja excluir essa template?"
					handle={() => handleDeleteTemplate(row)}
				/>
			</Space>
		),
	},
]
