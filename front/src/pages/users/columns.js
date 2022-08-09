import React from 'react'
import { Tag, Space, Button, Tooltip, Switch } from 'antd'
import { EditOutlined, SyncOutlined } from '@ant-design/icons'

import Delete from './components/Delete'

export function getColumns({
	handleDelete,
	handleEdit,
	handleResendInvite,
	handleToggleIsCompanyAdmin,
	loggedUser,
}) {
	const columns = [
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
						{!record.verified && (
							<Button
								icon={<SyncOutlined />}
								onClick={() => handleResendInvite(record.email)}
								style={{}}>
								Reenviar convite
							</Button>
						)}
						<Tooltip title={'Editar'}>
							<Button
								icon={<EditOutlined />}
								disabled={!loggedUser.is_company_admin}
								onClick={() => handleEdit({ ...record, groups })}
							/>
						</Tooltip>
						<Delete
							username={record.username}
							handleDelete={handleDelete}
							disabled={
								record.username === loggedUser.username ||
								!loggedUser.is_company_admin
							}
						/>
					</Space>
				)
			},
		},
	]

	if (loggedUser.is_company_admin) {
		columns.push({
			title: 'Administrador',
			dataIndex: 'is_company_admin',
			key: 'is_company_admin',
			render: (is_company_admin, record) => {
				return (
					<Switch
						checked={is_company_admin}
						disabled={record.username === loggedUser.username}
						onChange={() =>
							handleToggleIsCompanyAdmin({
								username: record.username,
								is_company_admin: !record.is_company_admin,
							})
						}
					/>
				)
			},
		})
	}
	return columns
}
