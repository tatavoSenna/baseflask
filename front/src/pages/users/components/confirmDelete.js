import React from 'react'
import { Popconfirm, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

ConfirmDelete.propTypes = {
	username: PropTypes.string,
	handleDelete: PropTypes.func,
}

function ConfirmDelete({ username, handleDelete }) {
	return (
		<div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
			<Tooltip title="Deletar">
				<Popconfirm
					title="Deseja deletar permanentemente este usuário?"
					onConfirm={() => handleDelete(username)}>
					<DeleteOutlined style={{ fontSize: '20px', color: 'red' }} />
				</Popconfirm>
			</Tooltip>
		</div>
	)
}

export default ConfirmDelete
