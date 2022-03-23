import React from 'react'
import { Upload, Button, message } from 'antd'
import { string, array, number, bool, func } from 'prop-types'
import { UploadOutlined } from '@ant-design/icons'

const Uploader = ({
	textButton,
	allowedTypes,
	allowedExtensions,
	multiple,
	max,
	fileList,
	setFileList,
	removeDoc,
}) => {
	const beforeUpload = (file) => {
		let allowed =
			allowedTypes.includes(file.type) ||
			allowedExtensions.includes(file.name.split('.').pop().toLowerCase())

		if (!allowed) {
			message.error(`${file.name} inválido`)
		} else {
			if (max > 1) {
				setFileList([...fileList, file])
			} else {
				setFileList([file])
			}
		}
		return false
	}

	const onRemove = (file) => {
		const index = fileList.indexOf(file)
		const newFileList = fileList.slice()
		newFileList.splice(index, 1)
		removeDoc()

		setFileList(newFileList)
	}

	return (
		<Upload
			fileList={fileList}
			multiple={multiple}
			beforeUpload={beforeUpload}
			onRemove={onRemove}
		>
			<Button icon={<UploadOutlined />} disabled={max === fileList.length}>
				{textButton}
			</Button>
		</Upload>
	)
}

Uploader.propTypes = {
	textButton: string,
	allowedTypes: array,
	allowedExtensions: array,
	multiple: bool,
	max: number,
	fileList: array,
	setFileList: func,
	removeDoc: func,
}

Uploader.defaultProps = {
	textButton: 'Arquivo de texto',
	allowedTypes: [],
	allowedExtensions: [],
	fileList: [],
	multiple: false,
	max: 1,
	removeDoc: {},
}

export default Uploader
