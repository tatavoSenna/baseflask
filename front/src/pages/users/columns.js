import React from 'react'

import Delete from './components/Delete'

export function getColumns({ handleDelete, loggedUser }) {
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
				<Delete
					username={username}
					handleDelete={handleDelete}
					disabled={loggedUser.username === username}
				/>
			),
		},
	]
}
