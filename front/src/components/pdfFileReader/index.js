import React from 'react'
import { string } from 'prop-types'

const PdfReader = ({ url }) => {
	return (
		<div
			style={{
				margin: 5,
				width: '100%',
			}}>
			<object data={url} type="application/pdf" width="100%" height="100%">
				<p>
					{url}
					<a href={url}> to the PDF!</a>
				</p>
			</object>
		</div>
	)
}

PdfReader.propTypes = {
	url: string,
}

PdfReader.defaultProps = {
	url: '',
}

export default PdfReader
