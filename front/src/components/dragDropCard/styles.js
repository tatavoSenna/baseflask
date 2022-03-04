import styled, { css } from 'styled-components'

export const Container = styled.div`
	position: relative;
`

export const Card = styled.div`
	position: relative;
	background: #fff;
	border-radius: 5px;
	padding: 25px 25px 10px 25px;
	border: 1px solid #f0f0f0;
	box-shadow: 0 1px 4px 0 rgba(192, 208, 230, 0.8);
	border-top: 20px solid rgba(230, 236, 245, 0.5);

	${(props) =>
		props.isDragging &&
		css`
			border: 2px dashed rgba(0, 0, 0, 0.2);
			padding-top: 17px !important;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			cursor: grabbing;

			& > * {
				opacity: 0;
			}
		`}
`

export const Handle = styled.div`
	position: absolute;
	top: 0;
	width: 100%;
	height: 20px;
	cursor: grab;
`

export const Indicator = styled.div`
	width: 100%;
	height: 0px;
	opacity: 0;
	border: 2px dashed transparent;
	background: rgba(26, 144, 255, 0.1);

	transition: height 150ms ease-out, opacity 150ms ease-out,
		margin 150ms ease-out;

	margin: ${(props) => (props.top ? '0px 0px 5px 0px' : '5px 0px 0px 0px')};

	${(props) =>
		props.active &&
		css`
			opacity: 1;
			height: 30px;
			border: 2px dashed rgb(26, 144, 255);
			margin: ${props.top ? '0px 0px 9px 0px' : '9px 0px 0px 0px'};
		`};
`
