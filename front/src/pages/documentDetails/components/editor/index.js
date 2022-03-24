import React from 'react'
import { useSelector } from 'react-redux'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledDocumentEditor from 'ckeditor5-custom-build/build/ckeditor'
import { string, func, bool, array } from 'prop-types'
import { classNames } from '~/utils'
import styles from './index.module.scss'
import { Spin } from 'antd'

const Editor = ({
	text,
	onUpdateText,
	block,
	versionLoading,
	comments,
	title,
}) => {
	const { userList } = useSelector(({ users }) => users)
	const loggedUser = useSelector(({ session }) => session)
	class CommentsIntegration {
		constructor(editor) {
			this.editor = editor
		}

		init() {
			const usersPlugin = this.editor.plugins.get('Users')
			const commentsRepositoryPlugin =
				this.editor.plugins.get('CommentsRepository')

			for (let user of userList) {
				usersPlugin.addUser(user)
			}

			usersPlugin.defineMe(loggedUser.id.toString())

			for (const commentThread of comments) {
				commentsRepositoryPlugin.addCommentThread(commentThread)
			}
		}
	}

	const editorConfiguration = {
		toolbar: {
			items: [
				'exportPdf',
				'exportWord',
				'heading',
				'|',
				'fontSize',
				'fontFamily',
				'fontColor',
				'fontBackgroundColor',
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
				'horizontalLine',
				'mediaEmbed',
				'|',
				'undo',
				'redo',
				'comment',
			],
		},
		language: 'pt-br',
		image: {
			styles: ['alignLeft', 'alignCenter', 'alignRight'],
			toolbar: [
				'imageStyle:alignLeft',
				'imageStyle:alignCenter',
				'imageStyle:alignRight',
				'|',
				'imageResize',
				'|',
				'imageTextAlternative',
				'|',
				'linkImage',
			],
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells',
				'tableProperties',
				'tableCellProperties',
			],
		},
		licenseKey: 'mboC54zxmZJKbEk7qX54q1Do7KHIuLn2fwPhCh4EsmrFlMGa2wi/lfvS',
		extraPlugins: [CommentsIntegration],
		exportPdf: {
			stylesheets: ['EDITOR_STYLES'],
			fileName: title,
			converterOptions: {
				format: 'A4',
				margin_top: '12.7mm',
				margin_bottom: '12.5mm',
				margin_right: '12.7mm',
				margin_left: '12.5mm',
				page_orientation: 'portrait',
			},
		},
		exportWord: {
			stylesheets: ['EDITOR_STYLES'],
			fileName: title,
			converterOptions: {
				format: 'A4',
				margin_top: '12.7mm',
				margin_bottom: '12.5mm',
				margin_right: '12.7mm',
				margin_left: '12.5mm',
				page_orientation: 'portrait',
			},
		},
		fontSize: {
			options: [8, 10, 12, 'default', 18, 20, 22],
			supportAllValues: true,
		},
	}

	return (
		<div
			style={{
				margin: 5,
				// minWidth: 600,
				width: '60%',
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
								const toolbarContainer =
									document.querySelector('#toolbar-container')
								if (toolbarContainer) {
									toolbarContainer.appendChild(editor.ui.view.toolbar.element)
								}
							}}
							editor={DecoupledDocumentEditor}
							config={editorConfiguration}
							onChange={(event, editor) => {
								const commentsRepository =
									editor.plugins.get('CommentsRepository')
								const commentThreadsData = commentsRepository.getCommentThreads(
									{
										skipNotAttached: true,
										skipEmpty: true,
										toJSON: true,
									}
								)
								onUpdateText(editor.getData(), commentThreadsData)
							}}
							data={!versionLoading ? text : ''}
							disabled={block || versionLoading}
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
	versionLoading: bool,
	comments: array,
	title: string,
}

export default Editor
