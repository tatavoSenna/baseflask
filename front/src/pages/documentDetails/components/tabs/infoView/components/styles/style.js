import styled from 'styled-components'
import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export const StyledTitle = styled(Title)`
	margin: 10px 0 24px !important;
	font-size: 15px !important;
`

export const StyledLabel = styled(Paragraph)`
	color: #000;
	font-size: 12px;
	margin: 0 !important;
`

export const StyledValue = styled(Paragraph)`
	color: #646464;
	font-size: 16px;
	margin: 0 0 14px 0;
`

export const StyledWrapperBox = styled.div`
	*:not(:last-child) {
		margin: 0 0 2px 0 !important;
	}
`
