import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { object, func } from 'prop-types'
import { Empty, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { editTemplatePartyAdd } from '~/states/modules/editTemplate'

import Party from './components/party'

const Signers = ({ data, setInputsFilled, inputsFilled }) => {
	const dispatch = useDispatch()

	// Once signers is rendered, it removes the red color on its tab
	useEffect(() => {
		setInputsFilled({ ...inputsFilled, signers: true })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleAddParty = () => {
		const newParty = {
			partyTitle: '',
			partySigners: [
				{
					title: '',
					party: '',
					anchor: [
						{
							anchor_string: '',
							anchor_x_offset: 0.0,
							anchor_y_offset: 0.0,
						},
					],
					fields: [
						{
							type: 'text',
							label: '',
							value: 'Nome',
							variable: '',
						},
						{
							type: 'email',
							label: '',
							value: 'Email',
							variable: '',
						},
					],
					status: '',
					signing_date: '',
				},
			],
		}

		dispatch(editTemplatePartyAdd({ newParty }))
	}

	return (
		<div style={{ maxWidth: '40rem' }}>
			{!data.parties.length ? (
				<Empty description="Sem Partes" style={{ marginBottom: '1.5rem' }} />
			) : (
				data.parties.map((item, index) => (
					<Party
						key={index}
						signers={item.partySigners}
						partyIndex={index}
						title={item.partyTitle}
					/>
				))
			)}
			<Button
				block
				icon={<PlusOutlined />}
				size="large"
				type="dashed"
				onClick={() => handleAddParty()}
				style={{ height: '4rem', marginBottom: '1rem' }}
			>
				Nova Parte
			</Button>
		</div>
	)
}

export default Signers

Signers.propTypes = {
	data: object,
	inputsFilled: object,
	setInputsFilled: func,
}
