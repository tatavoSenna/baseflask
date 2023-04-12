import styled from 'styled-components'
import { Collapse, Typography } from 'antd'

const { Title, Paragraph } = Typography

export const StyledTitle = styled(Title)`
	margin: ${({ $margin = '10px 0 24px' }) => $margin} !important;
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

export const StyledPanel = styled(Collapse.Panel)`
	border: 0 0 1px solid black !important;
	margin-bottom: 16px;

	.ant-collapse-content > .ant-collapse-content-box {
		padding: 0;
	}

	.ant-collapse-header {
		margin: 10px 0;
		padding: 0 0 0 20px !important;
	}
	.ant-collapse-header .ant-collapse-arrow {
		left: 0 !important;
		padding: 0 !important;
	}
`

export const StyledCollapse = styled(Collapse)`
	overflow: hidden;
	background: #fff;
`
