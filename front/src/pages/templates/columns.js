import React from 'react'
import { Button, Space, Switch, Checkbox } from 'antd'
import { StarOutlined, StarFilled } from '@ant-design/icons'

import Delete from '~/components/deleteConfirm'

export const getColumns = (
	handleToGo,
	handlePublishTemplate,
	handleDeleteTemplate,
	handleFavoriteTemplate
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
		title: 'Favorito',
		dataIndex: 'favorite',
		key: 'favorite',
		render: (text, record) => {
			return (
				<Button
					icon={
						record.favorite ? (
							<StarFilled style={{ color: 'gold' }} />
						) : (
							<StarOutlined />
						)
					}
					onClick={() =>
						handleFavoriteTemplate(record.id, !record.favorite)
					}></Button>
			)
		},
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
