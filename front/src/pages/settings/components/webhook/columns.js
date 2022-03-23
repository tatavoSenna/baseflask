import React from 'react'
import { Space, Tooltip, Button, Checkbox } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

export function getColumns(handleDeleteWebhook, handleEditWebhook) {
	return [
		{
			title: 'Webhook',
			dataIndex: 'webhook',
			key: 'webhook',
		},
		{
			title: '',
			dataIndex: 'action0',
			key: 'action0',
			render: (text, record) => {
				return (
					<div>
						<Checkbox
							checked={record.docx}
							onChange={() =>
								handleEditWebhook(
									record.id,
									record.docx ? false : true,
									record.docx ? record.pdf : false,
									record.url
								)
							}
						>
							Word
						</Checkbox>
						<Checkbox
							checked={record.pdf}
							onChange={() =>
								handleEditWebhook(
									record.id,
									record.pdf ? record.docx : false,
									record.pdf ? false : true,
									record.url
								)
							}
						>
							PDF
						</Checkbox>
					</div>
				)
			},
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
