import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import { string, func, bool } from 'prop-types'
import { classNames } from '~/utils'
import styles from './index.module.scss'
import { Form, Button } from 'antd'

const Editor = ({ text, textUpdate, onClickUpdate, onUpdateText, block }) => {
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
							data={text}
						/>
					</div>
				</div>
			</div>
			{text !== textUpdate && !block && (
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
}

export default Editor
