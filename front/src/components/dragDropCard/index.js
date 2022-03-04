import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useDrag, useDrop } from 'react-dnd'
import { Container, Card, Handle, Indicator } from './styles'
import PropTypes from 'prop-types'

const DragDropCard = ({ children, index, listIndex, move, name, style }) => {
	const dispatch = useDispatch()
	const dragRef = useRef()
	const dropRef = useRef()

	const [topActive, setTop] = useState(false)
	const [bottomActive, setBottom] = useState(false)

	const [{ isDragging }, drag, preview] = useDrag({
		item: { type: 'CARD', index: index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	})

	const [{ isOver }, drop] = useDrop({
		accept: 'CARD',
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
		hover(item, monitor) {
			const draggedIndex = item.index
			const targetIndex = index

			if (draggedIndex === targetIndex) {
				return
			}

			if (targetIndex > draggedIndex) {
				setBottom(true)
			} else {
				setTop(true)
			}
		},
		drop(item, monitor) {
			const draggedIndex = item.index
			const targetIndex = index

			if (draggedIndex === targetIndex) {
				return
			}
			dispatch(move({ from: draggedIndex, to: targetIndex, name, listIndex }))
		},
	})

	if (!isOver && topActive === true) {
		setTop(false)
	}

	if (!isOver && bottomActive === true) {
		setBottom(false)
	}

	drag(dragRef)
	drop(dropRef)
	preview(dropRef)

	return (
		<div ref={dropRef}>
			<Indicator top active={topActive} />
			<Container>
				<Card isDragging={isDragging} style={style}>
					{children}
				</Card>
				<Handle ref={dragRef} />
			</Container>
			<Indicator bottom active={bottomActive} />
		</div>
	)
}

DragDropCard.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number,
	listIndex: PropTypes.number,
	move: PropTypes.func,
	name: PropTypes.string,
	style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

export default DragDropCard
