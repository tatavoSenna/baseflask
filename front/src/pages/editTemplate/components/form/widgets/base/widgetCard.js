import React from 'react'
import { useDispatch } from 'react-redux'
import { object, number, string, node } from 'prop-types'
import { Collapse, Divider } from 'antd'
import {
	editTemplateFieldRemove,
	editTemplateMove,
} from '~/states/modules/editTemplate'
import Delete from '~/components/deleteConfirm'
import DragDropCard from '~/components/dragDropCard'
import { Panel, Title, ThinDivider } from './styles'

const WidgetCard = ({ data, pageIndex, fieldIndex, type, icon, children }) => {
	const dispatch = useDispatch()

	const handleRemoveField = () => {
		dispatch(editTemplateFieldRemove({ pageIndex, fieldIndex }))
	}

	return (
		<DragDropCard
			move={editTemplateMove}
			name="form"
			index={fieldIndex}
			listIndex={pageIndex}
			style={{
				padding: '0',
			}}>
			<Collapse ghost defaultActiveKey={[0]}>
				<Panel
					key={0}
					header={
						<div
							style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
							<div style={{ margin: '0px 6px 0px 5px' }}>{icon}</div>
							<Divider type="vertical" />
							<Title level={5} $filled={!!data.label}>
								{data.label || type}
							</Title>
						</div>
					}
					extra={
						<Delete
							handle={() => handleRemoveField()}
							title="Deseja excluir esse campo?"
							onClick={(e) => e.stopPropagation()}
						/>
					}>
					<ThinDivider $noTopMargin />

					<div>{children}</div>
				</Panel>
			</Collapse>
		</DragDropCard>
	)
}

WidgetCard.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	type: string,
	icon: node,
	children: node.isRequired,
}

export { WidgetCard }
