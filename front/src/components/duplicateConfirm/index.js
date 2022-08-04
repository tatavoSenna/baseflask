import React from 'react'
import { CopyOutlined } from '@ant-design/icons'
import { Popconfirm, Tooltip } from 'antd'
import { bool, func, string } from 'prop-types'

const Duplicate = ({ handle, title, isAdmin }) => {
	return (
		<Tooltip title={'Duplicar'}>
			{isAdmin ? (
				<CopyOutlined
					style={{
						fontSize: '20px',
						color: '#1890FF',
						verticalAlign: 'middle',
						margin: 'auto',
						cursor: 'pointer',
					}}
					onClick={handle}
				/>
			) : (
				<Popconfirm title={title} onConfirm={handle}>
					<CopyOutlined
						style={{
							fontSize: '20px',
							color: '#1890FF',
							verticalAlign: 'middle',
							margin: 'auto',
							cursor: 'pointer',
						}}
					/>
				</Popconfirm>
			)}
		</Tooltip>
	)
}

Duplicate.propTypes = {
	isAdmin: bool,
	handle: func,
	title: string,
}

export default Duplicate
