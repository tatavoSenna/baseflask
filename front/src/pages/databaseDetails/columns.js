import React from 'react'
import { Button } from 'antd'

import Delete from '~/components/deleteConfirm'

export const getColumns = (handleToGo, handleDelete) => [
	{
		title: 'Descrição',
		dataIndex: 'description',
		key: 'description',
		render: (text, row) => (
			<Button type="link" onClick={() => handleToGo(row)}>
				{text}
			</Button>
		),
	},
	{
		title: 'Tags',
		dataIndex: 'tags',
		key: 'tags',
	},
	{
		title: '',
		dataIndex: 'action',
		key: 'action',
		render: (text, row) => (
			<Delete
				title="Deseja excluir esse texto?"
				handle={() => handleDelete(row)}
			/>
		),
	},
]
