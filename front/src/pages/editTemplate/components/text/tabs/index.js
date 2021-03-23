import React from 'react'

import * as moment from 'moment'
import 'moment/locale/pt-br'

moment.locale('pt-br')

const Tabs = () => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: 24,
				margin: 5,
				minHeight: 500,
				minWidth: 500,
				background: '#fff',
				alignItems: 'center',
				border: '1px solid #F0F0F0',
			}}>
			<div
				style={{
					padding: 10,
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}></div>
		</div>
	)
}

Tabs.propTypes = {}

export default Tabs
