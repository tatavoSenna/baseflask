import React from 'react'
import { Popconfirm, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

Delete.propTypes = {
	companyName: PropTypes.string,
	handleDelete: PropTypes.func,
	disabled: PropTypes.bool,
}

function Delete({ companyName, handleDelete, disabled }) {
	return (
		<div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
			<Tooltip title={disabled ? '' : 'Deletar'}>
				<Popconfirm
					disabled={disabled}
					title="Deseja deletar permanentemente esta empresa?"
					onConfirm={() => handleDelete(companyName)}
				>
					<DeleteOutlined
						style={{ fontSize: '20px', color: disabled ? 'lightgray' : 'red' }}
					/>
				</Popconfirm>
			</Tooltip>
		</div>
	)
}

export default Delete
