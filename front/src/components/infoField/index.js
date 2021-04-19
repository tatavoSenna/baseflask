import React from 'react'
import { string } from 'prop-types'
import { Tooltip, Typography } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

const InfoField = ({ label, info }) => {
	return (
		<div>
			<Text>{label} </Text>
			{info && (
				<Tooltip title={info}>
					<InfoCircleOutlined style={{ color: '#1890ff' }} />
				</Tooltip>
			)}
		</div>
	)
}

InfoField.propTypes = {
	label: string,
	info: string,
}

InfoField.defaultProps = {
	label: '',
	info: '',
}

export default InfoField
