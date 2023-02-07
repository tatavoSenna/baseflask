import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { object, string, func, bool } from 'prop-types'

const HeaderButtons = ({
	id,
	history,
	infos,
	onDownload,
	onUpdate,
	textUpdate,
	text,
	loadingVersion,
	baseDocument,
}) => {
	const { versions, text_type, sent } = infos

	const handleEdit = () =>
		history.push({
			pathname: `/documents/${id}/edit`,
			state: { current: 0 },
		})

	// check if document is 'txt' and then see if user edit it directly on ckeditor
	// if that's true, the document can't be editable
	const [isEditable, setIsEditable] = useState(false)

	useEffect(() => {
		if (versions && text_type === '.txt') {
			const editable = !versions.some(
				(version) => version.only_updated_variables === undefined
			)

			setIsEditable(editable)
		}

		if (text_type === '.docx') setIsEditable(true)
	}, [versions, setIsEditable, text_type])

	// check if document is ready for create an new version when user type directly on ckeditor
	const [isUpdatable, setIsUpdatable] = useState(false)

	useEffect(() => {
		if (text_type === '.txt') {
			if (text !== textUpdate.text) {
				setIsUpdatable(true)
			} else {
				setIsUpdatable(false)
			}
		}
	}, [text_type, setIsUpdatable, text, textUpdate])

	return (
		<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 15 }}>
			<Button onClick={handleEdit} disabled={sent || !isEditable}>
				Editar Informações
			</Button>
			{text_type === '.txt' && (
				<Button
					disabled={sent || loadingVersion || !isUpdatable}
					onClick={() => onUpdate(textUpdate)}>
					Salvar modificações
				</Button>
			)}
			{(!text_type || text_type === '.txt') && !baseDocument ? (
				<></>
			) : (
				<Button onClick={onDownload}>Baixar Documento</Button>
			)}
		</div>
	)
}

export default HeaderButtons

HeaderButtons.propTypes = {
	id: string,
	history: object,
	infos: object,
	onDownload: func,
	onUpdate: func,
	textUpdate: object,
	text: string,
	loadingVersion: bool,
	baseDocument: string,
}
