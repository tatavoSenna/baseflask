import styled from 'styled-components'
import { Form, Typography, Collapse, Divider, Select } from 'antd'

export const Title = styled(Typography.Title)`
	&& {
		font-weight: normal;
		margin-left: 4px;
		margin-bottom: 0;
		user-select: none;
		color: ${(props) =>
			props.$filled ? 'hsl(0deg 0% 0% / 85%)' : 'hsl(0deg 0% 0% / 45%)'};
	}
`

export const Panel = styled(Collapse.Panel)`
	&& .ant-collapse-header {
		align-items: center;
		display: flex;
	}

	&&& .ant-collapse-content-box {
		padding: 0px 32px 12px;
	}
`

export const ThinDivider = styled(Divider)`
	&& {
		margin: ${(props) => (props.$noTopMargin ? '0' : '12px')} 0 12px 0;
	}
	.ant-divider-inner-text {
		font-size: 14px;
		color: gray;
	}
`

export const FormItem = styled(Form.Item)`
	margin-bottom: 4px;

	width: ${({ $width = '100%' }) => $width};

	.ant-form-item-label {
		width: ${({ $labelWidth = '94px' }) => $labelWidth};
		padding-top: ${({ $labelTop }) => $labelTop};
		text-align: left;
	}
`

export const ListItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 8px;
`

export const ValidatedSelect = styled(Select)`
	&& .ant-select-selector {
		${(props) => (props.$error ? 'border-color: #ff4d4f' : '')}
	}
`

export const TextIcon = styled.h1`
	width: 24px;
	text-align: center;
	user-select: none;
	font-size: 24px;
	font-family: monospace;
	margin: -12px 0px -10px 0px;
	color: ${(props) => (props.$error ? '#ff4d4f' : '#52c41a')};
`

export const styleIconValidation = (component) => styled(component)`
	user-select: none;
	font-size: 24px;
	color: ${(props) => (props.$error ? '#ff4d4f' : '#52c41a')};
`
