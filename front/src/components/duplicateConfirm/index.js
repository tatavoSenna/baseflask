import React from 'react'
import { CopyOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { func } from 'prop-types'

const Duplicate = ({ onClick }) => {
	return (
		<Tooltip title={'Duplicar documento'}>
			<CopyOutlined
				style={{
					fontSize: '20px',
					color: '#1890FF',
					verticalAlign: 'middle',
					margin: 'auto',
					cursor: 'pointer',
				}}
				onClick={onClick}
			/>
		</Tooltip>
	)
}

Duplicate.propTypes = {
	onClick: func,
}

export default Duplicate
