import { Button } from 'antd'
import React from 'react'
import { ContainerDiv, ContainerIcon, StyledText } from '../styles'
import { DownloadOutlined } from '@ant-design/icons'

import { func, object } from 'prop-types'

const TxtVersion = ({ item, moment, onDownload }) => {
	return (
		<ContainerDiv>
			<ContainerIcon>
				<StyledText style={{ fontSize: 14 }}>{item.description}</StyledText>
				<Button
					shape="circle"
					icon={<DownloadOutlined />}
					htmlType="button"
					onClick={(event) => onDownload(event, item)}
					onMouseDown={(event) => event.preventDefault()}
				/>
			</ContainerIcon>
			<StyledText style={{ display: 'block', padding: '5px 0' }}>
				Por: <StyledText>{item.created_by}</StyledText>
			</StyledText>

			<StyledText>
				Data:{' '}
				<StyledText>{moment(item.created_at).format('DD/MM/YYYY')}</StyledText>
			</StyledText>
		</ContainerDiv>
	)
}

export default TxtVersion

TxtVersion.propTypes = {
	item: object,
	moment: func,
	onDownload: func,
}
