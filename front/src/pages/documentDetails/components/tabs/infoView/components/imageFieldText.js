import React from 'react'
import { object } from 'prop-types'
import { Image } from 'antd'
import styled from 'styled-components'

import { StyledLabel, StyledValue } from './styles/style'

const ImageFieldText = ({ data }) => (
	<>
		<StyledLabel>{data.label || data.variable.name}</StyledLabel>
		<StyledValue
			style={{
				display: 'flex',
				gap: '6px',
				flexWrap: 'wrap',
			}}>
			<Image.PreviewGroup>
				{(Array.isArray(data.initialValue)
					? data.initialValue
					: [data.initialValue]
				).map((img, i) => (
					<ImageBorder key={i}>
						<Image width="100%" src={img} />
					</ImageBorder>
				))}
			</Image.PreviewGroup>
		</StyledValue>
	</>
)

const ImageBorder = styled.div`
	width: 104px;
	height: 104px;

	margin-top: 4px;
	padding: 8px;
	border: 1px solid #d9d9d9;
	border-radius: 2px;
`

ImageFieldText.propTypes = {
	data: object,
}

export default ImageFieldText
