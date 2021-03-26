import React from 'react'
import { useSelector } from 'react-redux'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledDocumentEditor from 'ckeditor5-custom-build/build/ckeditor'
import { string, func, bool, object, array } from 'prop-types'
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
	comments,
}) => {
	const { userList } = useSelector(({ users }) => users)
	const { loggedUser } = useSelector(({ session }) => session)
	class CommentsIntegration {
		constructor(editor) {
			this.editor = editor
		}

		init() {
			const usersPlugin = this.editor.plugins.get('Users')
			const commentsRepositoryPlugin = this.editor.plugins.get(
				'CommentsRepository'
			)

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
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
		},
		licenseKey: 'mboC54zxmZJKbEk7qX54q1Do7KHIuLn2fwPhCh4EsmrFlMGa2wi/lfvS',
		extraPlugins: [CommentsIntegration],
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
								if (toolbarContainer) {
									toolbarContainer.appendChild(editor.ui.view.toolbar.element)
								}
							}}
							editor={DecoupledDocumentEditor}
							config={editorConfiguration}
							onChange={(event, editor) => {
								const commentsRepository = editor.plugins.get(
									'CommentsRepository'
								)
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
			{text !== textUpdate.text && !block && !versionLoading && (
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
	textUpdate: object,
	onClickUpdate: func,
	onUpdateText: func,
	block: bool,
	versionLoading: bool,
	comments: array,
}

export default Editor
