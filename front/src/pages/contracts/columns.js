import React from 'react'
import { Tag, Button, Dropdown, Menu } from 'antd'
import { MoreOutlined } from '@ant-design/icons'

export const getColumns = (handleToGo) => [
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
		render: (text) => (
			<Dropdown overlay={() => getMenu()}>
				<MoreOutlined />
			</Dropdown>
		),
	},
]

export const getMenu = () => (
	<Menu style={{ zIndex: 1 }}>
		<Menu.Item onClick={() => {}}>Deletar</Menu.Item>
		<Menu.Item onClick={() => {}}>Compartilhar</Menu.Item>
		<Menu.Item onClick={() => {}}>Imprimir</Menu.Item>
	</Menu>
)
