import React, { useState, useCallback, useEffect } from 'react'
import { string, bool, func, oneOfType, array } from 'prop-types'
import { Breadcrumb, Button, Input } from 'antd'
import { EditOutlined, CheckOutlined } from '@ant-design/icons'
import styled from 'styled-components'

function BreadCrumb({ current, parent, editable, onEdit, onClickParent }) {
	const [editing, setEditing] = useState(false)
	const [title, setTitle] = useState(current)

	const handleEditChange = useCallback(
		(e) => setTitle(e.target.value.trim()),
		[setTitle]
	)

	const handleEditClick = useCallback(() => {
		setEditing(false)
		if (onEdit) onEdit(title)
	}, [onEdit, title])

	useEffect(() => {
		setTitle(current)
	}, [current])

	const disabled = title.trim().length === 0

	return (
		<Breadcrumb
			style={{ minHeight: '32px', display: 'flex', alignItems: 'center' }}>
			{parent &&
				(Array.isArray(parent) ? (
					parent.map((p, i) => (
						<ClickableItem
							key={i}
							onClick={onClickParent ? () => onClickParent(i) : undefined}>
							{p}
						</ClickableItem>
					))
				) : (
					<ClickableItem onClick={onClickParent}>{parent}</ClickableItem>
				))}
			<Breadcrumb.Item data-testid="current">
				{!editable ? (
					current
				) : editing ? (
					<>
						<Input
							style={{
								width: '82%',
								borderColor: disabled ? '#ff4d4f' : null,
							}}
							defaultValue={title}
							onChange={handleEditChange}
							placeholder="Título em branco"
						/>
						<Button
							onClick={handleEditClick}
							icon={<CheckOutlined style={{ fontSize: '18px' }} />}
							style={{ border: 'none', marginLeft: '5px' }}
							disabled={disabled}
						/>
					</>
				) : (
					<>
						{title}
						<Button
							onClick={() => setEditing(true)}
							icon={<EditOutlined style={{ fontSize: '18px' }} />}
							style={{ border: 'none', marginLeft: '5px' }}
						/>
					</>
				)}
			</Breadcrumb.Item>
		</Breadcrumb>
	)
}

const ClickableItem = styled(Breadcrumb.Item)`
	${(props) =>
		props.onClick &&
		`
	& {
		cursor: pointer;
	}

	&:hover {
		color: #1890ff;
	}
	`}
`

BreadCrumb.propTypes = {
	current: string,
	parent: oneOfType([string, array]),
	editable: bool,
	onEdit: func,
	onClickParent: func,
}

BreadCrumb.defaultProps = {
	parent: null,
	editable: false,
}

export default BreadCrumb
