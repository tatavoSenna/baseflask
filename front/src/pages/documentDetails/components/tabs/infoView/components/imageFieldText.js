import React from 'react'
import { object } from 'prop-types'
import { Image } from 'antd'
import styled from 'styled-components'

import { StyledLabel, StyledValue } from './styles/style'

const ImageFieldText = ({ data }) => {
	return (
		<>
			{data.field.label && <StyledLabel>{data.field.label}:</StyledLabel>}
			<StyledValue
				style={{
					display: 'flex',
					gap: '6px',
					flexWrap: 'wrap',
				}}>
				<Image.PreviewGroup>
					{(Array.isArray(data.value) ? data.value : [data.value]).map(
						(img, i) => (
							<ImageBorder key={i}>
								<CenteredImage src={img} />
							</ImageBorder>
						)
					)}
				</Image.PreviewGroup>
			</StyledValue>
		</>
	)
}

const ImageBorder = styled.div`
	width: 104px;
	height: 104px;

	margin-top: 4px;
	padding: 8px;
	border: 1px solid #d9d9d9;
	border-radius: 2px;

	.ant-image {
		height: 100%;
		width: 100%;
	}
`

const CenteredImage = styled(Image)`
	width: 100%;
	height: 100%;
	object-fit: contain;
	margin: auto;
`

ImageFieldText.propTypes = {
	data: object,
}

export default ImageFieldText
