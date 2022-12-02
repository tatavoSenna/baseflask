import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import { string, func, bool, array } from 'prop-types'
import { classNames } from '~/utils'
import styles from './index.module.scss'
import { Spin } from 'antd'
import './styles.css'

const Editor = ({ text, onUpdateText, block, versionLoading, title }) => {
	return (
		<div
			style={{
				height: '100%',
				width: '100%',
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
								heading: {
									options: [
										{
											model: 'paragraph',
											title: 'Paragraph',
											class: 'ck-heading_paragraph',
										},
										{
											model: 'heading1',
											view: 'h1',
											title: 'Heading 1',
											class: 'ck-heading_heading1',
										},
										{
											model: 'heading2',
											view: 'h2',
											title: 'Heading 2',
											class: 'ck-heading_heading2',
										},
										{
											model: 'heading3',
											view: 'h3',
											title: 'Heading 3',
											class: 'ck-heading_heading3',
										},
										{
											model: 'heading4',
											view: 'h4',
											title: 'Heading 4',
											class: 'ck-heading_heading4',
										},
									],
								},
							}}
							onChange={(event, editor) => {
								onUpdateText(editor.getData())
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
