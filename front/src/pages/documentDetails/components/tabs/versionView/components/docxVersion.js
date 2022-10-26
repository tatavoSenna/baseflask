import React from 'react'
import {
	ContainerIcon,
	StyledText,
	DownloadIcon,
	ContainerDiv,
} from '../styles'

import { array, func, object } from 'prop-types'

const DocxVersion = ({ item, moment, versions, onDownload }) => {
	return (
		<ContainerDiv>
			<ContainerIcon
				$changeopacity={item.id === Object.keys(versions)[versions.length - 1]}>
				<StyledText style={{ padding: '0 0 5px', fontSize: 14 }}>
					Por: <StyledText style={{ fontSize: 14 }}>{item.email}</StyledText>
				</StyledText>
				{item.id === Object.keys(versions)[versions.length - 1] && (
					<DownloadIcon
						style={{ fontSize: 25, padding: 5 }}
						onClick={(e) => {
							e.stopPropagation()
							onDownload()
						}}
					/>
				)}
			</ContainerIcon>
			<StyledText style={{ display: 'block', padding: '5px 0' }}>
				Por: <StyledText>{item.created_by}</StyledText>
			</StyledText>

			<StyledText $changeopacity={true}>
				Data:{' '}
				<StyledText>{moment(item.created_at).format('DD/MM/YYYY')}</StyledText>
			</StyledText>
		</ContainerDiv>
	)
}

export default DocxVersion

DocxVersion.propTypes = {
	item: object,
	moment: func,
	versions: array,
	onDownload: func,
}
