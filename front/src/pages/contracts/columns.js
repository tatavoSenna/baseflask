import React from 'react'
import { Tag, Button, Space } from 'antd'

import Delete from '~/components/deleteConfirm'

export const getColumns = (handleToGo, handleDeleteContract, is_admin) => [
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
		title: 'Criação',
		dataIndex: 'author',
		key: 'author',
	},
	{
		title: 'Data',
		dataIndex: 'createdAt',
		key: 'createdAt',
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		render: (text) => {
			switch (text) {
				case 'Análise Jurídico':
					return (
						<Tag color="geekblue" key={text}>
							{text}
						</Tag>
					)
				case 'Análise Diretoria':
					return (
						<Tag color="orange" key={text}>
							{text}
						</Tag>
					)
				case 'Ativo':
					return (
						<Tag color="purple" key={text}>
							{text}
						</Tag>
					)
				case 'Em revisão':
					return (
						<Tag color="pink" key={text}>
							{text}
						</Tag>
					)
				case 'Enviado para assinatura':
					return (
						<Tag color="volcano" key={text}>
							{text}
						</Tag>
					)
				case 'Assinado':
					return (
						<Tag color="green" key={text}>
							{text}
						</Tag>
					)
				case 'Arquivado':
					return (
						<Tag color="blue" key={text}>
							{text}
						</Tag>
					)
				default:
					return text
			}
		},
	},
	{
		title: '',
		dataIndex: 'action',
		key: 'action',
		render: (text, row) => (
			<Space size="middle">
				{is_admin && (
					<Delete
						title="Deseja excluir esse documento?"
						handle={() => handleDeleteContract(row)}
					/>
				)}
			</Space>
		),
	},
]
