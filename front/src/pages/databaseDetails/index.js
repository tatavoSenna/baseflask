import React, { useEffect, useState } from 'react'
import { Layout } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { listDatabases } from 'states/modules/databases'
import { getDetail, listItems } from '~/states/modules/databaseDetail'

import MainLayout from '~/components/mainLayout'
import DatabaseItemsListing from './components/databaseItemsListing'
import DatabaseTextEditor from './components/databaseTextEditor'

const DatabaseDetails = () => {
	const { id } = useParams()
	const dispatch = useDispatch()
	const history = useHistory()

	const [editedText, setEditedText] = useState(false)

	useEffect(() => {
		dispatch(getDetail({ id }))
		dispatch(listItems({ id }))
	}, [dispatch, id])

	const handleReturnParent = (i) => {
		if (i === 1) {
			setEditedText(false)
			dispatch(listItems({ id }))
		} else {
			dispatch(listDatabases())
			history.push('/databases')
		}
	}

	const handleCreateText = (title) => {
		setEditedText(title)
	}

	const handleEditText = (row) => {
		setEditedText(row.id)
	}

	const handleSaveText = () => {
		setEditedText(false)
	}

	return (
		<MainLayout>
			<Layout style={{ padding: '0', background: '#fff', width: '100%' }}>
				{!editedText ? (
					<DatabaseItemsListing
						onReturnParent={handleReturnParent}
						onCreateText={handleCreateText}
						onEditText={handleEditText}
					/>
				) : (
					<DatabaseTextEditor
						id={editedText}
						onReturnParent={handleReturnParent}
						onSaveText={handleSaveText}
					/>
				)}
			</Layout>
		</MainLayout>
	)
}

export default DatabaseDetails
