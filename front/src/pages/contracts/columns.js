import React from 'react'
import { Tag, Button, Space, Tooltip } from 'antd'
import { FolderOutlined, FolderOpenOutlined } from '@ant-design/icons'

import Delete from '~/components/deleteConfirm'

export const getColumns = (
	handleToGo,
	handleDelete,
	setMoveNode,
	sortTable,
	selectedDocuments
) => [
	{
		title: 'Descrição',
		dataIndex: 'title',
		key: 'title',
		render: (text, row) => (
			<Space size="small">
				{row.is_folder ? <FolderOutlined /> : null}
				<Button type="link" onClick={() => handleToGo(row)}>
					{text}
				</Button>
			</Space>
		),
		sorter: true,
		onHeaderCell: (column) => {
			return {
				onClick: () => {
					sortTable('title')
				},
			}
		},
	},
	{
		title: 'Template',
		dataIndex: 'template_name',
		key: 'template_name',
		sorter: true,
		onHeaderCell: (column) => {
			return {
				onClick: () => {
					sortTable('template')
				},
			}
		},
	},
	{
		title: 'Criado por',
		dataIndex: 'author',
		key: 'author',
		sorter: true,
		onHeaderCell: (column) => {
			return {
				onClick: () => {
					sortTable('username')
				},
			}
		},
	},
	{
		title: 'Criado em',
		dataIndex: 'createdAt',
		key: 'createdAt',
		sorter: true,
		onHeaderCell: (column) => {
			return {
				onClick: () => {
					sortTable('creation_date')
				},
			}
		},
	},
	{
		title: 'Prazo',
		dataIndex: 'dueDate',
		key: 'dueDate',
		sorter: true,
		onHeaderCell: (column) => {
			return {
				onClick: () => {
					sortTable('due_date')
				},
			}
		},
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
		sorter: true,
		onHeaderCell: (column) => {
			return {
				onClick: () => {
					sortTable('status')
				},
			}
		},
	},
	{
		title: '',
		dataIndex: 'action',
		key: 'action',
		render: (text, row) => {
			const isSelected = selectedDocuments.includes(row.id)

			return (
				<Space size="middle">
					{isSelected ? (
						<Delete
							title={`Deseja excluir os ${selectedDocuments.length} itens selecionados?`}
							handle={() => handleDelete(selectedDocuments)}
							tooltip={{
								title: 'Deletar selecionados',
							}}
						/>
					) : (
						<Delete
							title={
								row.is_folder
									? 'Deseja excluir essa pasta?'
									: 'Deseja excluir esse documento?'
							}
							handle={() => handleDelete(row)}
						/>
					)}
					<Tooltip title={isSelected ? '' : 'Mover para outra pasta'}>
						<FolderOpenOutlined
							style={{
								fontSize: '20px',
								color: isSelected ? 'lightgray' : '#1890FF',
								verticalAlign: 'middle',
								margin: 'auto',
							}}
							onClick={isSelected ? undefined : () => setMoveNode(row)}
						/>
					</Tooltip>
				</Space>
			)
		},
	},
]
