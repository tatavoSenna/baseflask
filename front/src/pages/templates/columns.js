import React from 'react'
import { Button, Space, Switch } from 'antd'

import Delete from '~/components/deleteConfirm'

export const getColumns = (
	handleToGo,
	handlePublishTemplate,
	handleDeleteTemplate,
	is_admin
) => [
	{
		title: 'Publicado',
		dataIndex: 'published',
		key: 'published',
		render: (published, row) => {
			return (
				<Switch
					checked={published}
					disabled={!is_admin}
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
		render: (text, row) => (
			<Space size="middle">
				{is_admin && (
					<Delete
						title="Deseja excluir essa template?"
						handle={() => handleDeleteTemplate(row)}
					/>
				)}
			</Space>
		),
	},
]
