import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { string, func, array, bool, number } from 'prop-types'
import Editor from './editor'
import Uploader from '~/components/uploadFile'
import { Switch, Typography, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { editTemplateText } from '~/states/modules/editTemplate'
import styled from 'styled-components'
import AddVariableModal from './modal/addVariableModal'

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
	widgetIndexes,
}) => {
	const dispatch = useDispatch()

	const [editor, setEditor] = useState(null)

	const getEditorFromCKEditor = (editor) => {
		setEditor(editor)
	}

	const [textVariable, setTextVariable] = useState('')

	const handleClickGetVariable = (e) => {
		setTextVariable(e)
	}

	const updateText = (e) => {
		let value = e
		if (e.target) {
			value = e.target.value
		}
		dispatch(editTemplateText({ value }))
	}

	const [openModalVariable, setOpenModalVariable] = useState(false)

	const addVariable = () => {
		setOpenModalVariable(true)
	}

	const handleCancel = () => {
		setOpenModalVariable(false)
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
		<Wrapper
			$flexDirection="column"
			style={{
				flexGrow: 1,
				minWidth: 0,
			}}>
			<AddVariableModal
				editor={editor}
				open={openModalVariable}
				onCancel={handleCancel}
				handleClickGetVariable={handleClickGetVariable}
				widgetIndexes={widgetIndexes}
			/>
			<Wrapper
				$alignItems="center"
				$justifyContent="space-between"
				style={{
					marginBottom: 15,
				}}>
				<Wrapper $alignItems="center">
					<Switch
						checked={checked}
						disabled={files.length > 0 || data}
						onChange={setChecked}
					/>
					<Title style={{ margin: '0 0 0 15px' }} level={4}>
						{checked ? 'Insira um arquivo' : 'Insira o texto'}
					</Title>
				</Wrapper>
				<Button type="primary" onClick={addVariable}>
					Nova Variável
				</Button>
			</Wrapper>
			{checked ? (
				<Wrapper>
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
				</Wrapper>
			) : (
				<Editor
					text={data}
					onUpdateText={updateText}
					textVariable={textVariable}
					getEditor={getEditorFromCKEditor}
				/>
			)}
		</Wrapper>
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
	widgetIndexes: number,
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: ${({ $flexDirection = 'row' }) => $flexDirection};
	justify-content: ${({ $justifyContent = 'normal' }) => $justifyContent};
	align-items: ${({ $alignItems = 'normal' }) => $alignItems};
`
