import styled from 'styled-components'
import { Form, Typography, Collapse, Divider } from 'antd'

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
	}

	&&& .ant-collapse-content-box {
		padding-top: 0;
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
	margin-bottom: 8px;

	.ant-form-item-label {
		width: ${(props) => props.$labelWidth};
	}
`
