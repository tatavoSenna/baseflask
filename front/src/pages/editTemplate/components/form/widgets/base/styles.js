import styled from 'styled-components'
import { Form, Typography, Collapse, Divider, Select, Input } from 'antd'
import MaskedInput from 'antd-mask-input'

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

export const CollapseFields = styled(Collapse)`
	border: 1px solid #d9d9d9;
	margin-bottom: 24px;
`

export const ValidateCollapseFields = styled(Collapse)`
	border: 1px solid ${({ $error }) => ($error ? `#ff0000` : `#d9d9d9`)};
	margin-bottom: 24px;
`

export const HeaderFieldsTitle = styled.p`
	display: flex;
	width: 100%;
	margin: 0;
`

export const PanelWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	column-gap: 12px;
`

export const FormItemFields = styled(Form.Item)`
	flex-direction: ${({ $direction = 'column' }) => $direction};
	flex: ${({ $flex = '1 0 100%' }) => $flex};
	align-items: ${({ $align = 'stretch' }) => $align};
	margin: ${({ $margin = '0 0 16px' }) => $margin};

	.ant-form-item-label {
		width: ${({ $width = '100%' }) => $width};
		text-align: left;
	}
`

export const Panel = styled(Collapse.Panel)`
	${({ $compact }) =>
		$compact &&
		`
	 border: 1px solid #d9d9d9;
	 margin-bottom: 24px;
	 border-bottom:  1px solid #d9d9d9 !important;
	`}
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
	margin-bottom: ${({ $marginBottom = '16px' }) => $marginBottom};

	width: ${({ $width = '100%' }) => $width};

	flex-direction: ${({ $formDirection = 'row' }) => $formDirection};

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

export const ValidatedInput = styled(Input)`
	${(props) =>
		props.$error
			? `
				border-color: #ff4d4f;
				z-index: 1;
			`
			: ''}
`

export const ValidatedMaskedInput = styled(MaskedInput)`
	${(props) =>
		props.$error
			? `
				border-color: #ff4d4f;
				z-index: 1;
			`
			: ''}
`

export const ValidatedSelect = styled(Select)`
	&& .ant-select-selection-placeholder {
		${({ $placeholderError }) =>
			$placeholderError
				? `
				color: #ff0000;
				opacity: 0.4;
			`
				: ''}
	}
	&& .ant-select-selector {
		${(props) =>
			props.$error
				? `
					border-color: #ff4d4f;
					z-index: 1;
				`
				: ''}
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

export const InputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	margin-bottom: ${({ $marginBottom = '16px' }) => $marginBottom};
	label {
		padding: 0 0 8px;
	}
`

export const ButtonWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
`
