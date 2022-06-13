import React from 'react'
import { Button, Card, Result } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import { func, string } from 'prop-types'

const DraftIndicator = ({ title, onClick }) => {
	return (
		<div
			style={{
				width: '60%',
				height: '100%',
				margin: '5px',
				background: '#bfbfbf',
				padding: '2px',
			}}>
			<Card
				bordered={false}
				style={{
					maxWidth: '100%',
					maxHeight: '99.3%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					aspectRatio: '1 / 1.4142',
					margin: 'auto',
				}}>
				<Result
					icon={<FileTextOutlined />}
					title={<p style={{ color: 'gray' }}>{title}</p>}
					extra={
						<Button type="primary" onClick={onClick}>
							Continuar preenchimento
						</Button>
					}
				/>
			</Card>
		</div>
	)
}

export default DraftIndicator

DraftIndicator.propTypes = {
	title: string,
	onClick: func,
}
