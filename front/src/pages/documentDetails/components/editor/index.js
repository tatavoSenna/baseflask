import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import { string, func, bool } from 'prop-types'
import { classNames } from '~/utils'
import styles from './index.module.scss'
import { Form, Button, Spin } from 'antd'

const Editor = ({
	text,
	textUpdate,
	onClickUpdate,
	onUpdateText,
	block,
	versionLoading,
}) => {
	return (
		<div
			style={{
				margin: 5,
			}}>
			<div className={classNames(styles.documentEditor)}>
				<div
					id="toolbar-container"
					className={classNames(styles.documentEditorToolbar)}></div>
				<div className={classNames(styles.documentEditorEditableContainer)}>
					<div className={classNames(styles.ckEditorEditable)}>
						{versionLoading && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									minHeight: 100,
									width: '100%',
									background: '#fff',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
								<Spin spinning={versionLoading} />
							</div>
						)}
						<CKEditor
							onInit={(editor) => {
								const toolbarContainer = document.querySelector(
									'#toolbar-container'
								)
								toolbarContainer.appendChild(editor.ui.view.toolbar.element)
							}}
							editor={DecoupledEditor}
							config={{}}
							onChange={(event, editor) => onUpdateText(editor.getData())}
							data={!versionLoading ? text : ''}
						/>
					</div>
				</div>
			</div>
			{text !== textUpdate && !block && !versionLoading && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						paddingTop: 20,
					}}>
					<Form.Item>
						<Button
							type="primary"
							htmlType="button"
							onClick={() => onClickUpdate(textUpdate)}
							disabled={block}>
							Criar versão
						</Button>
					</Form.Item>
				</div>
			)}
		</div>
	)
}

Editor.propTypes = {
	text: string,
	textUpdate: string,
	onClickUpdate: func,
	onUpdateText: func,
	block: bool,
	versionLoading: bool,
}

export default Editor
