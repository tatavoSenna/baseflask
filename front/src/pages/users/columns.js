import React from 'react'

import ConfirmDelete from './components/confirmDelete'

export function getColumns({ handleDelete }) {
	return [
		{
			title: 'Nome',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Sobrenome',
			dataIndex: 'surname',
			key: 'surname',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: '',
			dataIndex: 'username',
			key: 'username',
			render: (username) => (
				<ConfirmDelete username={username} handleDelete={handleDelete} />
			),
		},
	]
}
