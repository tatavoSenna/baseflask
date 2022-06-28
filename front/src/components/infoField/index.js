import React from 'react'
import { func, string } from 'prop-types'
import { Button, Tooltip, Typography } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

const InfoOptionalField = ({ label, info, onClick }) => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				width: '100%',
			}}>
			<div>
				<Text>{label}</Text>
				{info && (
					<Tooltip title={info}>
						<InfoCircleOutlined style={{ color: '#1890ff' }} />
					</Tooltip>
				)}
			</div>
			<Button size="small" onClick={onClick}>
				Limpar campo
			</Button>
		</div>
	)
}

const InfoField = ({ label, info }) => {
	return (
		<div>
			<Text style={{ fontWeight: 500 }}>{label} </Text>
			{info && (
				<Tooltip title={info}>
					<InfoCircleOutlined style={{ color: '#1890ff' }} />
				</Tooltip>
			)}
		</div>
	)
}

InfoOptionalField.propTypes = {
	label: string,
	info: string,
	onClick: func,
}

InfoField.propTypes = {
	label: string,
	info: string,
}

InfoField.defaultProps = {
	label: '',
	info: '',
}

export { InfoOptionalField }
export default InfoField
