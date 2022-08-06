import React, { useState, useEffect, useRef } from 'react'
import { string, func, bool, oneOfType, array } from 'prop-types'
import { Upload, message, Modal } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

const ImageUpload = ({
	initialValue,
	multiple = false,
	onChange,
	className,
}) => {
	const [modalImage, setModalImage] = useState(null)
	const [loading, setLoading] = useState('')

	const [fileList, setFileList] = useState(
		initialValue
			? (Array.isArray(initialValue) ? initialValue : [initialValue]).map(
					(img, i) => ({
						uid: `-${i}`,
						url: img,
						name: '',
						status: 'done',
					})
			  )
			: []
	)

	const changedFiles = useRef(false)
	const lastMultiple = useRef(multiple)

	// Removes extra images from filesList when multiple is disabled
	useEffect(() => {
		if (multiple !== lastMultiple.current) {
			lastMultiple.current = multiple
			changedFiles.current = true

			setFileList((files) =>
				!multiple && files.length > 0 ? [files[0]] : files
			)
		}
	}, [multiple, setFileList])

	// Calls onChange when filesList changes
	useEffect(() => {
		if (changedFiles.current && onChange) {
			changedFiles.current = false

			onChange(
				fileList.length > 0
					? multiple
						? fileList.map((image) => image.url)
						: fileList[0].url
					: undefined
			)
		}
	}, [fileList, multiple, onChange])

	const beforeUpload = (file) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
		if (!isJpgOrPng) {
			message.error('Por favor, selecione um arquivo JPG/PNG!')
		} else {
			setLoading(true)
			getBase64(file, (imageUrl) => {
				file.url = imageUrl

				changedFiles.current = true
				setFileList(multiple ? [...fileList, file] : [file])
				setLoading(false)
			})
		}
		return false
	}

	const getBase64 = (img, callback) => {
		const reader = new FileReader()
		reader.addEventListener('load', () => callback(reader.result))
		reader.readAsDataURL(img)
	}

	const uploadButton = (
		<div>
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	)

	return (
		<div
			className={className}
			style={{ display: 'flex', marginBottom: '1rem' }}>
			<Upload
				fileList={fileList}
				listType="picture-card"
				multiple={multiple}
				beforeUpload={beforeUpload}
				onPreview={(img) => setModalImage(img)}
				onRemove={(img) => {
					changedFiles.current = true
					setFileList(fileList.filter((v, i) => v !== img))
				}}>
				{(fileList.length === 0 || multiple) && uploadButton}
			</Upload>
			<Modal
				visible={modalImage !== null}
				title={modalImage?.name}
				footer={null}
				onCancel={() => setModalImage(null)}>
				{modalImage && (
					<img alt="imagem" style={{ width: '100%' }} src={modalImage.url} />
				)}
			</Modal>
		</div>
	)
}

ImageUpload.propTypes = {
	initialValue: oneOfType([string, array]),
	multiple: bool,
	onChange: func,
	className: string,
}

export default ImageUpload
