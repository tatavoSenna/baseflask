import styled from 'styled-components'
import { Collapse, Radio, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

const { Title } = Typography

export const DisplayNone = styled.div`
	display: none;
`
export const SBtnGroup = styled(Radio.Group)`
	display: flex;
	column-gap: 12px;
	flex-wrap: wrap;

	.ant-radio-button-wrapper:first-child {
		border-width: ${(props) =>
			props.btnProps === 'natural_person' ? `2px` : `1px`};
		font-weight: ${(props) =>
			props.btnProps === 'natural_person' ? `500` : `400`};
	}
	.ant-radio-button-wrapper:last-child {
		border-width: ${(props) =>
			props.btnProps === 'legal_person' ? `2px` : `1px`};
		font-weight: ${(props) =>
			props.btnProps === 'legal_person' ? `500` : `400`};
	}
`
export const SBtnRadio = styled(Radio.Button)`
	order: 0;
	flex: 1;
	height: 56px;
	font-size: 14px;
	margin-bottom: 0;

	display: flex;
	justify-content: center;
	align-items: center;

	&:hover {
		color: rgba(0, 0, 0, 0.65);
	}
`
export const PersonContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	column-gap: 12px;

	@media (max-width: 600px) {
		flex-direction: column;
		> * {
			flex: 1 0 100%;
		}
	}
`
export const Label = styled(Title)`
	margin: 10px 0 24px !important;
	font-size: 18px !important;
	font-weight: 500;
`
export const PersonTitle = styled.p`
	font-size: 18px;
	font-weight: 500;
	margin-bottom: 0;
`

export const StyledPanel = styled(Collapse.Panel)`
	border: 0 !important;

	.ant-collapse-content > .ant-collapse-content-box {
		padding: 24px 0 0 0 !important;
	}

	.ant-collapse-header {
		margin: 0;
		padding: 0 !important;
		display: flex;
		align-items: center;
		width: 100%;
	}

	.ant-collapse-header .ant-collapse-arrow {
		top: 0 !important;
		left: 0 !important;
		padding: 0 !important;
		position: static !important;
		margin-right: 10px;
	}
`

export const StyledCollapse = styled(Collapse)`
	overflow: hidden;
	background: #fff;

	padding: 10px;
	margin-bottom: 20px;
	border: 1px solid #d9d9d9;
`

export const StyledHeaderWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`

export const StyledTextHeader = styled.div`
	font-size: 18px !important;
	font-weight: 500;
`

export const StyledDelete = styled(DeleteOutlined)`
	font-size: 20px;
	color: #1890ff;
	vertical-align: middle;
`
