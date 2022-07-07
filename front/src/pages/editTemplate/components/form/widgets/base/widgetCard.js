import React from 'react'
import { object, number, string, node, func, bool } from 'prop-types'
import { Collapse, Divider } from 'antd'
import { editTemplateMove } from '~/states/modules/editTemplate'
import Delete from '~/components/deleteConfirm'
import DragDropCard from '~/components/dragDropCard'
import { Panel, Title, ThinDivider } from './styles'
import styled from 'styled-components'

const WidgetCard = ({
	data,
	pageIndex,
	fieldIndex,
	type,
	icon,
	children,
	onRemove,
	compact,
}) => {
	//style={{ border: '1px solid #d9d9d9', marginBottom: 24 }}
	const content = (
		<Collapse ghost defaultActiveKey={[1]}>
			<Panel
				$compact={compact}
				key={0}
				header={
					!compact ? (
						<div
							style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
							<div style={{ margin: '0px 6px 0px 5px' }}>{icon}</div>
							<Divider type="vertical" />
							<Title level={5} $filled={!!data.label}>
								{data.label || type}
							</Title>
						</div>
					) : (
						<div style={{ display: 'flex', width: '100%', margin: 0 }}>
							{data.label || type}
						</div>
					)
				}
				extra={
					<Delete
						handle={() => onRemove(pageIndex, fieldIndex)}
						title="Deseja excluir esse campo?"
						onClick={(e) => e.stopPropagation()}
					/>
				}>
				{!compact ? (
					<>
						<ThinDivider $noTopMargin />
						<div>{children}</div>
					</>
				) : (
					<WidgetContent>{children}</WidgetContent>
				)}
			</Panel>
		</Collapse>
	)

	return !compact ? (
		<DragDropCard
			move={editTemplateMove}
			name="form"
			index={fieldIndex}
			listIndex={pageIndex}
			style={{
				padding: '0',
			}}>
			{content}
		</DragDropCard>
	) : (
		content
	)
}

WidgetCard.propTypes = {
	data: object,
	pageIndex: number,
	fieldIndex: number,
	type: string,
	icon: node,
	children: node.isRequired,
	onRemove: func,
	compact: bool,
}

export { WidgetCard }

const WidgetContent = styled.div`
	.ant-row {
		flex-direction: column;
	}
`
