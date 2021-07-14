import React from 'react'
import { Space, Tooltip, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

export function getColumns(handleDeleteWebhook) {
	return [
		{
			title: 'Webhook',
			dataIndex: 'webhook',
			key: 'webhook',
		},
		{
			title: '',
			dataIndex: 'action',
			key: 'action',
			render: (text, record) => {
				return (
					<Space size="middle">
						<Tooltip title={'Deletar Webhook'}>
							<Button
								icon={<DeleteOutlined />}
								onClick={() => {
									handleDeleteWebhook(record.id)
								}}
							/>
						</Tooltip>
					</Space>
				)
			},
		},
	]
}
