import React from 'react'
import { Button, Space } from 'antd'

import Delete from '~/components/deleteConfirm'

export const getColumns = (handleToGo, handleDeleteTemplate) => [
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
				<Delete
					title="Deseja excluir essa template?"
					handle={() => handleDeleteTemplate(row)}
				/>
			</Space>
		),
	},
]
