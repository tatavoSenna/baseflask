import React from 'react'
import { Popconfirm, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const Delete = ({ handle, title, disabled, onClick = () => {} }) => (
	<div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
		<Tooltip title={disabled ? '' : 'Deletar'} placement="left">
			<Popconfirm disabled={disabled} title={title} onConfirm={handle}>
				<DeleteOutlined
					style={{
						fontSize: '20px',
						color: disabled ? 'lightgray' : '#1890FF',
						margin: 'auto',
					}}
					onClick={onClick}
				/>
			</Popconfirm>
		</Tooltip>
	</div>
)

Delete.propTypes = {
	title: PropTypes.string,
	handle: PropTypes.func,
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
}

export default Delete
