import React from 'react'
import { string, func, array, bool } from 'prop-types'
import Editor from './editor'
import Uploader from '~/components/uploadFile'
import { Switch, Typography } from 'antd'

const { Title } = Typography

const Text = ({ data, files, updateFile, updateForm, checked, setChecked }) => {
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
							updateForm(files.length > 0, 'isFile')
						}}
						fileList={files}
						allowedTypes={[
							'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
						]}
					/>
				</div>
			) : (
				<Editor text={data} onUpdateText={updateForm} />
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
}
