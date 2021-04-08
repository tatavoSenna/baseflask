import styled, { css } from 'styled-components'

export const Card = styled.div`
	position: relative;
	background: #fff;
	border-radius: 5px;
	margin-bottom: 20px;
	padding: 25px 25px 10px 25px;
	border: 1px solid #f0f0f0;
	box-shadow: 0 1px 4px 0 rgba(192, 208, 230, 0.8);
	border-top: 20px solid rgba(230, 236, 245, 0.5);
	cursor: grab;

	${(props) =>
		props.isDragging &&
		css`
			border: 2px dashed rgba(0, 0, 0, 0.2);
			padding-top: 43px;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			cursor: grabbing;

			& > * {
				opacity: 0;
			}
		`}
`

export const Indicator = styled.div`
	height: 0;
	border: 0;
	background: rgba(26, 144, 255, 0.1);
	border-radius: 5px;
	margin-bottom: 20px;
	transition: height 150ms ease-out;

	${(props) =>
		props.top &&
		css`
			height: 30px;
			border: 2px dashed rgb(26, 144, 255);
		`}
	${(props) =>
		props.bottom &&
		css`
			height: 30px;
			border: 2px dashed rgb(26, 144, 255);
		`}
`
