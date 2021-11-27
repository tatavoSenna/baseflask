import React from 'react'
import { Tag, Button, Space, Tooltip } from 'antd'
import { FolderOutlined, FolderOpenOutlined } from '@ant-design/icons'

import Delete from '~/components/deleteConfirm'

export const getColumns = (
	handleToGo,
	handleDeleteContract,
	handleDeleteFolder,
	handleFolderSelect,
	is_admin,
	setMoveNode
) => [
	{
		title: 'Descrição',
		dataIndex: 'title',
		key: 'title',
		render: (text, row) => (
			<Space size="small">
				{row.is_folder ? <FolderOutlined /> : null}
				<Button
					type="link"
					onClick={() =>
						!row.is_folder ? handleToGo(row) : handleFolderSelect(row)
					}>
					{text}
				</Button>
			</Space>
		),
	},
	{
		title: 'Template',
		dataIndex: 'template_name',
		key: 'template_name',
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
				{!row.is_folder ? (
					<Delete
						title="Deseja excluir esse documento?"
						handle={() => handleDeleteContract(row)}
					/>
				) : (
					<Delete
						title="Deseja excluir essa pasta?"
						handle={() => handleDeleteFolder(row)}
					/>
				)}
				<Tooltip title={'Mover para outra pasta'}>
					<Button
						icon={
							<FolderOpenOutlined
								style={{
									fontSize: '20px',
									color: '#1890FF',
									margin: 'auto',
								}}
							/>
						}
						style={{
							border: 'none',
						}}
						onClick={() => setMoveNode(row)}
					/>
				</Tooltip>
			</Space>
		),
	},
]
