import React from 'react'
import { Typography, Button } from 'antd'
import propTypes from 'prop-types'
import styled from 'styled-components'

const { Title, Paragraph } = Typography

const Plan = ({
	planType,
	info,
	value,
	selected,
	price,
	onChangePrice,
	onSubmitStripe,
	priceId,
	activePlan,
}) => {
	const infoObj = {
		users: !isNaN(info.users) ? 'Até ' + info.users + ' usuários' : info.users,
		documents: `${info.documents} documentos por mês`,
		models: `${info.models} modelos mensais`,
		webhooks: 'Integrações via webhooks',
		management: 'Gestão de documentos',
		creation: 'Criação de documentos por usuários externos',
		docusign: info.docusign || null,
		d4sign: info.d4sign || null,
	}

	const paragraph = (item) => {
		if (item != null) {
			return (
				<ParagraphContainer>
					<SParagraph>{item}</SParagraph>
				</ParagraphContainer>
			)
		}
	}

	selected = value === priceId ? true : false

	const freePlan = value === 'price_1KP85XHIZcJ4D4nayv0Sx6dc'

	const handleCurrentPlan = () => {
		if ((priceId === undefined || priceId === null) && freePlan) return true

		if (selected) return true

		if (activePlan !== undefined && planType === activePlan.type) return true

		return false
	}

	return (
		<PlanContainer $color={handleCurrentPlan()}>
			<TitlePrice>
				<Title style={{ margin: 0 }} level={4}>
					{planType}
				</Title>
				<PriceParagraph>{price}</PriceParagraph>
			</TitlePrice>
			<ParagraphWrapper>
				{paragraph(infoObj.users)}
				{paragraph(infoObj.documents)}
				{paragraph(infoObj.models)}
				{paragraph(infoObj.webhooks)}
				{paragraph(infoObj.management)}
				{paragraph(infoObj.creation)}
				{paragraph(infoObj.docusign)}
				{paragraph(infoObj.d4sign)}
			</ParagraphWrapper>
			<FormButton $visibility={freePlan}>
				<form onSubmit={onSubmitStripe}>
					<Button
						id="checkout-and-portal-button"
						onClick={() => onChangePrice(value)}
						type="primary"
						htmlType="submit"
						disabled={selected ? true : false}>
						{selected ? 'Plano atual' : 'Assinar'}
					</Button>
				</form>
			</FormButton>
		</PlanContainer>
	)
}

Plan.propTypes = {
	planType: propTypes.string,
	info: propTypes.object,
	value: propTypes.string,
	selected: propTypes.bool,
	price: propTypes.string,
	onChangePrice: propTypes.func,
	onSubmitStripe: propTypes.func,
	priceId: propTypes.string,
	activePlan: propTypes.object,
}

export default Plan

const PlanContainer = styled.div`
	border-style: solid;
	padding: 20px;
	width: 100%;
	max-width: 35%;
	display: flex;
	flex-direction: column;

	border-color: ${(props) => (props.$color ? `#40a9ff` : `#e8e8e8`)};
	border-width: ${(props) => (props.$color ? `2px` : `1px`)};
`

const TitlePrice = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`

const PriceParagraph = styled.div`
	margin: 0;
	font-size: 18px;
	font-weight: bold;
`

const ParagraphWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin: 15px 0;
	> div:first-child {
		border-width: 1px 0;
	}
`

const ParagraphContainer = styled.div`
	border: solid #e8e8e8;
	border-width: 0 0 1px;
	width: 100%;
	padding: 15px 0;
`

const SParagraph = styled(Paragraph)`
	margin: 0 !important;
`

const FormButton = styled.div`
	margin: auto 0 0;

	visibility: ${(props) => (props.$visibility ? `hidden` : `visibility`)};
`
