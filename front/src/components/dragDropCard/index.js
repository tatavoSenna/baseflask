import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useDrag, useDrop } from 'react-dnd'
import { Card, Indicator } from './styles'
import PropTypes from 'prop-types'

const DragDropCard = ({ children, index, listIndex, move, name, style }) => {
	const dispatch = useDispatch()
	const ref = useRef()
	const [top, setTop] = useState(false)
	const [bottom, setBottom] = useState(false)

	const [{ isDragging }, dragRef] = useDrag({
		item: { type: 'CARD', index: index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	})

	const [{ isOver }, dropRef] = useDrop({
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

	if (!isOver && top === true) {
		setTop(false)
	}

	if (!isOver && bottom === true) {
		setBottom(false)
	}

	dragRef(dropRef(ref))

	return (
		<>
			<Indicator top={top} />
			<Card ref={ref} isDragging={isDragging} style={style}>
				{children}
			</Card>
			<Indicator bottom={bottom} />
		</>
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
