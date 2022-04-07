import styled from 'styled-components'
import { Radio, Typography } from 'antd'

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

export const AddressSeparator = styled.p`
	order: 2;
	flex: 1 0 100%;

	font-size: 18px;
	font-weight: 500;
	margin-bottom: 24px;

	display: ${(props) => (props.$displayNone ? `none` : `block`)};
`

export const Lebal = styled(Title)`
	margin: 10px 0 24px !important;
	font-size: 18px !important;
	font-weight: 500;
`

export const PersonTitle = styled.p`
	font-size: 18px;
	font-weight: 500;
	margin-bottom: 0;
`
