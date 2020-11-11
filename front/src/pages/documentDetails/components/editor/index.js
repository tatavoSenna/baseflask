import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import { string } from 'prop-types'
import { classNames } from '~/utils'
import styles from './index.module.scss'
import { Typography } from 'antd'

const Editor = ({ text, title }) => {
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
						<Typography
							style={{
								textAlign: 'center',
								fontSize: 20,
								color: 'black',
								marginBottom: 50,
							}}>
							{title}
						</Typography>
						<CKEditor
							onInit={(editor) => {
								const toolbarContainer = document.querySelector(
									'#toolbar-container'
								)
								toolbarContainer.appendChild(editor.ui.view.toolbar.element)
							}}
							editor={DecoupledEditor}
							config={{}}
							onChange={(event, editor) => console.log({ event, editor })}
							data={text}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

Editor.propTypes = {
	text: string,
	title: string,
}

export default Editor
