import React from 'react'
import { string, object } from 'prop-types'
import { Breadcrumb } from 'antd'

function BreadCrumb({ current, parent }) {
	const { Item } = Breadcrumb
	return (
		<Breadcrumb>
			{parent && <Item>{parent}</Item>}
			<Item data-testid="current">{current}</Item>
		</Breadcrumb>
	)
}

BreadCrumb.propTypes = {
	current: object.isRequired,
	parent: string,
}

BreadCrumb.defaultProps = {
	parent: null,
}

export default BreadCrumb
