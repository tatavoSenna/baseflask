import React from 'react'
import { Popconfirm, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const Delete = ({ handle, title, disabled, tooltip, onClick = () => {} }) => (
	<div>
		<Tooltip
			placement="left"
			{...(tooltip ?? {})}
			title={disabled ? '' : tooltip?.title ?? 'Deletar'}>
			<Popconfirm disabled={disabled} title={title} onConfirm={handle}>
				<DeleteOutlined
					style={{
						fontSize: '20px',
						color: disabled ? 'lightgray' : '#1890FF',
						verticalAlign: 'middle',
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
	tooltip: PropTypes.object,
	onClick: PropTypes.func,
}

export default Delete
