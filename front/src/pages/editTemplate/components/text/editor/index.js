import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import { string, func, bool } from 'prop-types'
import { classNames } from '~/utils'
import styles from './index.module.scss'
import './styles.css'

const Editor = ({ text, onUpdateText, block, getEditor }) => {
	return (
		<>
			<div className={classNames(styles.documentEditor)}>
				<div
					id="toolbar-container"
					className={classNames(styles.documentEditorToolbar)}></div>
				<div className={classNames(styles.documentEditorEditableContainer)}>
					<div className={classNames(styles.ckEditorEditable)}>
						<CKEditor
							onReady={(editor) => {
								const toolbarContainer =
									document.querySelector('#toolbar-container')

								if (toolbarContainer) {
									toolbarContainer.appendChild(editor.ui.view.toolbar.element)
								}
								getEditor(editor)
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
							onChange={(event, editor) =>
								onUpdateText(editor.getData(), 'text')
							}
							data={text}
							disabled={block}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

Editor.propTypes = {
	text: string,
	onUpdateText: func,
	block: bool,
	getEditor: func,
}

export default Editor
