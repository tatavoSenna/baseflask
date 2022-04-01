import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { string, func, array, bool } from 'prop-types'
import Editor from './editor'
import Uploader from '~/components/uploadFile'
import { Switch, Typography, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { editTemplateText } from '~/states/modules/editTemplate'

const { Title } = Typography

const Text = ({
	data,
	files,
	updateFile,
	checked,
	setChecked,
	setDownloadButton,
	setInputsFilled,
	docPosted,
	removeDoc,
}) => {
	const dispatch = useDispatch()

	const updateText = (e) => {
		let value = e
		if (e.target) {
			value = e.target.value
		}
		dispatch(editTemplateText({ value }))
	}

	useEffect(() => {
		setInputsFilled((filled) => ({
			...filled,
			text: (() => {
				if (data === '' && !files.length) {
					return false
				}
				return true
			})(),
		}))
	}, [data, files, setInputsFilled])

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				flexWrap: 'wrap',
				paddingBottom: 50,
			}}>
			<div
				style={{
					display: 'flex',
				}}>
				<Switch
					checked={checked}
					disabled={files.length > 0 || data}
					onChange={setChecked}
				/>
				<Title style={{ marginLeft: 15, width: '50%' }} level={4}>
					{checked ? 'Insira um arquivo' : 'Insira o texto'}
				</Title>
			</div>

			{checked ? (
				<div
					style={{
						display: 'flex',
					}}>
					<Uploader
						setFileList={(files) => {
							updateFile(files)
						}}
						fileList={files}
						allowedTypes={[
							'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
						]}
						allowedExtensions={['docx']}
						removeDoc={removeDoc}
					/>

					{files.length && docPosted ? (
						<Button
							style={{ marginLeft: 15 }}
							icon={<DownloadOutlined />}
							onClick={() => {
								setDownloadButton()
							}}
						/>
					) : null}
				</div>
			) : (
				<Editor text={data} onUpdateText={updateText} />
			)}
		</div>
	)
}

export default Text

Text.propTypes = {
	data: string,
	updateForm: func,
	files: array,
	updateFile: func,
	checked: bool,
	setChecked: func,
	setDownloadButton: func,
	setInputsFilled: func,
	docPosted: bool,
	removeDoc: func,
}
