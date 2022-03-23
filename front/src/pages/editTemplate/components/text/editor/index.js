import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledDocumentEditor from 'ckeditor5-custom-build/build/ckeditor'
import { string, func, bool } from 'prop-types'
import { classNames } from '~/utils'
import styles from './index.module.scss'
import './styles.css'

const editorConfiguration = {
	toolbar: {
		items: [
			'exportPdf',
			'exportWord',
			'heading',
			'|',
			'fontSize',
			'fontFamily',
			'|',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'highlight',
			'|',
			'alignment',
			'|',
			'numberedList',
			'bulletedList',
			'|',
			'indent',
			'outdent',
			'|',
			'todoList',
			'link',
			'blockQuote',
			'imageUpload',
			'insertTable',
			'mediaEmbed',
			'|',
			'undo',
			'redo',
			'comment',
		],
	},
	language: 'pt-br',
	image: {
		toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
	},
	table: {
		contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
	},
	licenseKey: 'mboC54zxmZJKbEk7qX54q1Do7KHIuLn2fwPhCh4EsmrFlMGa2wi/lfvS',
	exportPdf: {
		stylesheets: ['EDITOR_STYLES'],
		fileName: `documento.pdf`,
		converterOptions: {
			format: 'A4',
			margin_top: '12.7mm',
			margin_bottom: '12.5mm',
			margin_right: '12.7mm',
			margin_left: '12.5mm',
			page_orientation: 'portrait',
		},
	},
}

const Editor = ({ text, onUpdateText, block }) => {
	return (
		<div
			style={{
				margin: 5,
			}}
		>
			<div className={classNames(styles.documentEditor)}>
				<div
					id="toolbar-container"
					className={classNames(styles.documentEditorToolbar)}
				></div>
				<div className={classNames(styles.documentEditorEditableContainer)}>
					<div className={classNames(styles.ckEditorEditable)}>
						<CKEditor
							onInit={(editor) => {
								const toolbarContainer =
									document.querySelector('#toolbar-container')
								toolbarContainer.appendChild(editor.ui.view.toolbar.element)
							}}
							editor={DecoupledDocumentEditor}
							config={editorConfiguration}
							onChange={(event, editor) =>
								onUpdateText(editor.getData(), 'text')
							}
							data={text}
							disabled={block}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

Editor.propTypes = {
	text: string,
	onUpdateText: func,
	block: bool,
}

export default Editor
