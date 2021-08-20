import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { array, string, func, any } from 'prop-types'
import { Tabs, Empty, Button } from 'antd'
import { DndProvider, DragSource, DropTarget } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { PlusOutlined } from '@ant-design/icons'
import {
	editTemplatePageAdd,
	editTemplatePageRemove,
	editTemplatePageMove,
} from '~/states/modules/editTemplate'
import Page from './page'

const { TabPane } = Tabs

const TabNode = (props) => {
	const { connectDragSource, connectDropTarget, children } = props

	return connectDragSource(connectDropTarget(children))
}

const cardTarget = {
	drop(props, monitor) {
		const dragKey = monitor.getItem().index
		const hoverKey = props.index

		if (dragKey === hoverKey) {
			return
		}

		props.moveTabNode(dragKey, hoverKey)
		monitor.getItem().index = hoverKey
	},
}

const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const WrapTabNode = DropTarget('DND_NODE', cardTarget, (connect) => ({
	connectDropTarget: connect.dropTarget(),
}))(
	DragSource('DND_NODE', cardSource, (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}))(TabNode)
)

const DraggableTabs = (props) => {
	const dispatch = useDispatch()

	const moveTabNode = (dragKey, hoverKey) => {
		dispatch(editTemplatePageMove({ from: dragKey, to: hoverKey }))
	}

	const onChange = (e) => {
		props.setCurrent(e)
	}

	const renderTabBar = (props, DefaultTabBar) => (
		<DefaultTabBar {...props}>
			{(node) => (
				<WrapTabNode key={node.key} index={node.key} moveTabNode={moveTabNode}>
					{node}
				</WrapTabNode>
			)}
		</DefaultTabBar>
	)

	const { children } = props

	const tabs = []
	React.Children.forEach(children, (c) => {
		tabs.push(c)
	})

	const add = () => {
		const newPage = {
			title: 'Nova Página',
			fields: [],
		}
		dispatch(editTemplatePageAdd({ newPage }))
		props.setCurrent(`${props.data.length}`)
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<Tabs
				style={{ maxWidth: '40rem' }}
				onEdit={add}
				onChange={onChange}
				activeKey={props.current}
				renderTabBar={renderTabBar}
				{...props}
				tabBarExtraContent={
					<Button
						onClick={() => add()}
						icon={<PlusOutlined />}
						style={{
							border: 'none',
							position: 'relative',
							left: '-5px',
							top: '1px',
						}}
					/>
				}></Tabs>
		</DndProvider>
	)
}

const TemplateForm = ({ data }) => {
	const dispatch = useDispatch()
	const [current, setCurrent] = useState('0')

	const handleRemovePage = (pageIndex) => {
		if (pageIndex === data.length - 1) {
			setCurrent(`${current - 1}`)
		}
		dispatch(editTemplatePageRemove({ pageIndex }))
	}
	return (
		<>
			<DraggableTabs current={current} setCurrent={setCurrent} data={data}>
				{data.map((page, index) => (
					<TabPane key={index} tab={page.title} closable={false}>
						<Page
							pageIndex={index}
							data={data[index]}
							handleRemovePage={handleRemovePage}
						/>
					</TabPane>
				))}
			</DraggableTabs>
			{!data.length && (
				<Empty description="Sem Páginas" style={{ marginTop: '3rem' }} />
			)}
		</>
	)
}

export default TemplateForm

TemplateForm.propTypes = {
	data: array,
}

DraggableTabs.propTypes = {
	current: string,
	setCurrent: func,
	data: array,
	children: any,
}
