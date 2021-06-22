import React from 'react'
import { Space } from 'antd'

export function getColumns() {
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
				return <Space size="middle"></Space>
			},
		},
	]
}
