import { Menu, Typography } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const { Text } = Typography

export const StyledText = styled(Text)`
	font-size: 0.75rem;
	line-height: 2;
	color: #000;
	opacity: 0.65;

	opacity: ${(props) => props.$changeopacity === true && `1`};
	font-weight: ${(props) => props.$changeopacity === true && `700`};

	* {
		opacity: ${(props) => props.$changeopacity === true && `1`};
	}
`

export const StyledMenu = styled(Menu)`
	width: 100%;
	border: none;

	*:not(:first-child) {
		border-top: none;
	}

	* {
		margin: 0 !important;
	}

	*:hover {
		cursor: ${(props) =>
			props.$docxverification === true ? `pointer` : `default`};
	}
`

export const ItemContainer = styled(Menu.Item)`
	display: flex;
	flex-direction: column;
	justify-content: center;

	background-color: #ffffff !important;
	border: solid #cccccc;

	border-width: ${(props) =>
		props.$propsbordertop === true ? `1px 0` : `0 0 1px`} !important;
	border-width: ${(props) =>
		props.$propsbordertop === false ? `0 0 1px` : `1px 0`} !important;

	padding: ${(props) =>
		props.$propsdifferentpadding === false
			? `70px 5px`
			: `60px 5px`} !important;

	* {
		color: ${(props) => props.$propscolor && `#0099ff`};
		opacity: ${(props) => props.$propscolor && `1`};
	}
`

export const ContainerIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;

	* {
		font-weight: ${(props) =>
			props.$changeopacity === true ? `700` : `500`} !important;
		opacity: ${(props) => props.$changeopacity === true && `1`};
	}
`

export const ContainerDiv = styled.div`
	* {
		font-weight: 700 !important;
	}
`

export const DownloadIcon = styled(DownloadOutlined)`
	*:hover {
		cursor: pointer;
	}
`
