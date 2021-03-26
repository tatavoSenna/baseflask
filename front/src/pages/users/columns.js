import React from 'react'
import { Tag, Space, Button, Tooltip } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import Delete from './components/Delete'

export function getColumns({ handleDelete, loggedUser, handleEdit }) {
	return [
		{
			title: 'Nome',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Grupos',
			dataIndex: 'groups',
			key: 'groups',
			render: (groups) => (
				<>
					{groups.map((group) => (
						<Tag key={group.name}>{group.name}</Tag>
					))}
				</>
			),
		},
		{
			title: '',
			dataIndex: 'action',
			key: 'action',
			render: (text, record) => {
				const groups = record.groups.map((item) => item.group_id.toString())
				return (
					<Space size="middle">
						<Delete
							username={record.username}
							handleDelete={handleDelete}
							disabled={loggedUser.username === record.username}
						/>
						<Tooltip title={'Editar'}>
							<Button
								icon={<EditOutlined />}
								onClick={() => handleEdit({ ...record, groups })}
							/>
						</Tooltip>
					</Space>
				)
			},
		},
	]
}
