import React from 'react'
import { Button } from 'antd'

import Delete from '~/components/deleteConfirm'

export const getColumns = (handleToGo, handleDelete) => [
	{
		title: 'Descrição',
		dataIndex: 'title',
		key: 'title',
		render: (text, row) => (
			<Button type="link" onClick={() => handleToGo(row)}>
				{text}
			</Button>
		),
	},
	{
		title: 'Tipo',
		dataIndex: 'table_type',
		key: 'table_type',
		render: (text) => {
			switch (text) {
				case 'text':
					return 'Textos'
				default:
					return text
			}
		},
	},
	{
		title: 'Quantidade de dados',
		dataIndex: 'text_count',
		key: 'text_count',
		render: (count) => (count === 1 ? '1 Texto' : count + ' Textos'),
	},
	{
		title: '',
		dataIndex: 'action',
		key: 'action',
		render: (text, row) => (
			<Delete
				title="Deseja excluir esse banco de textos?"
				handle={() => handleDelete(row)}
			/>
		),
	},
]
