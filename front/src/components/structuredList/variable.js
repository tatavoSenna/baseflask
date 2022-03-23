import React from 'react'
import { array, func, number } from 'prop-types'
import { Card, Badge, Divider } from 'antd'
import InputFactory from '~/components/inputFactory'
import Delete from '~/components/deleteConfirm'

const StructuredVariable = ({ name, fieldKey, remove, structure }) => {
	return (
		<Card key={fieldKey} style={{ marginBottom: '20px' }}>
			{structure.map((field, i) => {
				const pageFieldsData = JSON.parse(JSON.stringify(field))
				pageFieldsData['list'] = name
				return (
					<InputFactory
						key={i}
						data={[pageFieldsData]}
						visible={[true]}
						// disabled={!isEdit}
					/>
				)
			})}

			<div
				style={{
					display: 'flex',
					background: 'rgba(230, 236, 245, 0.5)',
					height: '40px',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					margin: '25px -25px -25px -25px',
				}}
			>
				<Badge count={name + 1} style={{ background: '#1890ff' }} />
				<Divider
					type="vertical"
					style={{
						height: '20px',
						borderLeft: '1px solid #bdbdbd',
						marginTop: '2px',
					}}
				/>
				<Delete
					handle={() => remove(name)}
					title="Deseja excluir esse campo?"
				/>
			</div>
		</Card>
	)
}

export default StructuredVariable

StructuredVariable.propTypes = {
	name: number,
	fieldKey: number,
	remove: func,
	structure: array,
}
