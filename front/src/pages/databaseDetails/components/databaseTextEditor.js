import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Layout, PageHeader, Button, Typography, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import BreadCrumb from 'components/breadCrumb'
import {
	newText,
	editText,
	editTextRequest,
	getText,
} from 'states/modules/databaseDetail'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import { func, number, oneOfType, string } from 'prop-types'

const DatabaseTextEditor = ({ id, onReturnParent, onSaveText }) => {
	const dispatch = useDispatch()
	const { database, editedText } = useSelector(
		({ databaseDetail }) => databaseDetail
	)

	const handleEditDescriptionButton = (title) =>
		dispatch(editText({ description: title }))

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
					<div id="toolbar-container" />
					<div
						style={{
							padding: 'calc(2 * var(--ck-spacing-large))',
							border: '1px hsl(0, 0%, 82.7%) solid',
							borderRadius: 'var(--ck-border-radius)',
							overflowY: 'scroll',
							height: '50vh',
						}}>
						<CKEditor
							onReady={(editor) => {
								const toolbarContainer =
									document.querySelector('#toolbar-container')
								if (toolbarContainer) {
									toolbarContainer.appendChild(editor.ui.view.toolbar.element)
								}
							}}
							editor={DecoupledEditor}
							config={{
								removePlugins: [
									'ImageToolbar',
									'CKFinder',
									'MediaEmbed',
									'ImageToolbar',
									'ImageUpload',
									'EasyImage',
									'uploadImage',
									'mediaEmbed',
									'Link',
									'Autoformat',
								],
							}}
							onChange={(event, editor) => {
								dispatch(editText({ text: editor.getData() }))
							}}
							data={editedText.text}
						/>
					</div>
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
