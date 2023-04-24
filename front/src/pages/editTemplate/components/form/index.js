import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { object, string, func, any } from 'prop-types'
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
import styled from 'styled-components'

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

const DraggableTabs = ({ setCurrent, ...props }) => {
	const dispatch = useDispatch()

	const moveTabNode = (dragKey, hoverKey) => {
		dispatch(editTemplatePageMove({ from: dragKey, to: hoverKey }))
	}

	const onChange = (e) => {
		setCurrent(e)
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
		dispatch(editTemplatePageAdd({ newPage, currentIndex: props.current }))
		setCurrent(`${parseInt(props.current) + 1}`)
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<Tabs
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

const TemplateForm = ({ data, setInputsFilled, getWidgetIndexes }) => {
	const dispatch = useDispatch()
	const [current, setCurrent] = useState('0')

	const handleRemovePage = useCallback(
		(pageIndex) => {
			if (pageIndex === data.form.length - 1) {
				setCurrent(`${current - 1}`)
			}
			dispatch(editTemplatePageRemove({ pageIndex }))
		},
		[data.form.length, current, dispatch, setCurrent]
	)

	const [allVariables, setAllVariables] = useState([])
	useEffect(() => {
		const newVariables = data.variables.reduce((a, page) => [...a, ...page], [])

		if (
			allVariables.length !== newVariables.length ||
			allVariables.some(
				(variable, i) =>
					newVariables[i]?.name !== variable?.name ||
					newVariables[i]?.fields !== variable?.fields ||
					newVariables[i]?.main !== variable?.main
			)
		) {
			setAllVariables(newVariables)
		}
	}, [data.variables, allVariables])

	useEffect(() => {
		setInputsFilled((filled) => ({
			...filled,
			form: (() => {
				if (
					data.form.length > 0 &&
					data.form.every(
						(page) => page.fields.filter((f) => f.variable).length > 0
					) &&
					data.form.every((page) => page.valid.every((v) => v))
				) {
					return true
				}
				return false
			})(),
		}))
	}, [data.form, setInputsFilled])

	useEffect(() => {
		getWidgetIndexes(parseInt(current))
	}, [current, getWidgetIndexes])

	return (
		<WidgetWrapper>
			<DraggableTabs current={current} setCurrent={setCurrent}>
				{data.form.map((page, index) => (
					<TabPane
						style={{ heigth: '100%' }}
						key={index}
						tab={page.title}
						closable={false}>
						<Page
							pageIndex={index}
							data={data.form[index]}
							variables={allVariables}
							handleRemovePage={handleRemovePage}
						/>
					</TabPane>
				))}
			</DraggableTabs>
			{!data.form.length && (
				<Empty description="Sem Páginas" style={{ marginTop: '3rem' }} />
			)}
		</WidgetWrapper>
	)
}

export default React.memo(TemplateForm)

TemplateForm.propTypes = {
	data: object,
	setInputsFilled: func,
	getWidgetIndexes: func,
}

DraggableTabs.propTypes = {
	current: string,
	setCurrent: func,
	children: any,
}

const WidgetWrapper = styled.div`
	min-width: 600px;
	width: 640px;

	.ant-tabs.ant-tabs-top,
	.ant-tabs.ant-tabs-top.ant-tabs-mobile,
	.ant-tabs-content.ant-tabs-content-top {
		height: 100%;
	}
`
