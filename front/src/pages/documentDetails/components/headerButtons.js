import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { object, string, func } from 'prop-types'

const HeaderButtons = ({ id, history, infos, onDownload }) => {
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

	return (
		<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 15 }}>
			<Button onClick={handleEdit} disabled={sent || !isEditable}>
				Editar
			</Button>
			<Button onClick={onDownload}>Baixar Documento</Button>
		</div>
	)
}

export default HeaderButtons

HeaderButtons.propTypes = {
	id: string,
	history: object,
	infos: object,
	onDownload: func,
}
