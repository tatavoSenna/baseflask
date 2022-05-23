import styled from 'styled-components'

import { Typography } from 'antd'

const { Title } = Typography

export const DisplayNone = styled.div`
	display: none;
`

export const StyledTitle = styled(Title)`
	margin: 10px 0 24px !important;
	font-size: 15px !important;
`

export const FlexContainer = styled.div`
	> * {
		display: flex;
		flex-direction: column;

		.ant-form-item-label {
			padding: 0;
			text-align: start;
		}
	}
`
