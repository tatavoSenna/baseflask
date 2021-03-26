// import get from 'lodash/get'
// import sortBy from 'lodash/sortBy'
import React from 'react'
import * as moment from 'moment'
import 'moment/locale/pt-br'
import { Avatar, Typography } from 'antd'

const { Text } = Typography

moment.locale('pt-br')

export const selectAllContracts = (payload) =>
	payload.map((contract) => ({
		id: parseInt(contract.id, 10),
		key: parseInt(contract.id, 10),
		title: contract.title,
		clientId: contract.client_id,
		author: (
			<>
				<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />{' '}
				<Text>{contract.user.name}</Text>
			</>
		),
		authorEmail: contract.user.email,
		documentId: contract.document_model_id,
		status: contract.status,
		createdAt: contract.created_at
			? moment(contract.created_at).format('DD/MM/YYYY')
			: null,
	}))
