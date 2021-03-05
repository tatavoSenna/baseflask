import React from 'react'
import { string, func } from 'prop-types'
import Editor from './editor'

const Text = ({ data, updateForm }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				paddingBottom: 50,
			}}>
			<div>
				<Editor text={data} onUpdateText={updateForm} />
			</div>
		</div>
	)
}

export default Text

Text.propTypes = {
	data: string,
	updateForm: func,
}
