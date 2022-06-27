import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Layout, PageHeader, Button, Input, Typography, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import BreadCrumb from 'components/breadCrumb'
import {
	newText,
	editText,
	editTextRequest,
	getText,
} from 'states/modules/databaseDetail'
import { func, number, oneOfType, string } from 'prop-types'

const DatabaseTextEditor = ({ id, onReturnParent, onSaveText }) => {
	const dispatch = useDispatch()
	const { database, editedText } = useSelector(
		({ databaseDetail }) => databaseDetail
	)

	const handleEditDescriptionButton = (title) =>
		dispatch(editText({ description: title }))

	const handleTextChange = (e) => dispatch(editText({ text: e.target.value }))

	const handleSaveText = (e) => {
		dispatch(editTextRequest())
		onSaveText()
	}

	useEffect(() => {
		if (typeof id === 'string') {
			dispatch(newText({ description: id }))
		} else {
			dispatch(getText({ id }))
		}
	}, [id, dispatch])

	return (
		<>
			<PageHeader>
				<BreadCrumb
					parent={['Bancos de textos', database.title]}
					editable={!editedText.loading}
					current={editedText.description}
					onClickParent={onReturnParent}
					onEdit={handleEditDescriptionButton}
				/>
			</PageHeader>

			<LayoutSpinFullHeight
				style={{ backgroundColor: '#fff', padding: '24px 1% 0px' }}>
				<Button
					form="createTemplate"
					key="button"
					type="primary"
					htmlType="submit"
					disabled={
						editedText.loading ||
						editedText.text === '' ||
						editedText.description === ''
					}
					onClick={handleSaveText}
					style={{
						width: '80px',
						marginLeft: 'calc(100% - 80px)',
					}}>
					Salvar
				</Button>
				<Spin spinning={editedText.loading}>
					<Typography.Text style={{ fontSize: '14px', paddingBottom: '8px' }}>
						Texto
					</Typography.Text>
					<Input.TextArea
						value={editedText.text}
						disabled={editedText.loading}
						onChange={handleTextChange}
						style={{
							height: '70%',
						}}
					/>
				</Spin>
			</LayoutSpinFullHeight>
		</>
	)
}

const LayoutSpinFullHeight = styled(Layout)`
	.ant-spin-nested-loading,
	.ant-spin-container {
		height: 100%;
	}
`

DatabaseTextEditor.propTypes = {
	id: oneOfType([number, string]),
	onReturnParent: func,
	onSaveText: func,
}

export default DatabaseTextEditor
