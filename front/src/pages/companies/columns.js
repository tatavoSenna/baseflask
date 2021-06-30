import React from 'react'
import { Space, Tooltip, Button } from 'antd'
import { UserSwitchOutlined } from '@ant-design/icons'

export function getColumns(handleChangeUserCompany, currentCompanyId) {
	return [
		{
			title: 'Nome',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: '',
			dataIndex: 'action',
			key: 'action',
			render: (text, record) => {
				return (
					<Space size="middle">
						<Tooltip title={'Trocar de empresa'}>
							<Button
								disabled={currentCompanyId === parseInt(record.id)}
								icon={<UserSwitchOutlined />}
								onClick={() => {
									handleChangeUserCompany(record.id)
								}}
							/>
						</Tooltip>
					</Space>
				)
			},
		},
	]
}
