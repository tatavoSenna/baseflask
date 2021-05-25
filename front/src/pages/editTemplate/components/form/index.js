import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { array } from 'prop-types'
import { Menu, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import {
	editTemplatePageAdd,
	editTemplatePageRemove,
} from '~/states/modules/editTemplate'

import Page from './page'

const TemplateForm = ({ data }) => {
	const dispatch = useDispatch()
	const [current, setCurrent] = useState('0')

	const handleNav = (e) => {
		if (e.key === '+') {
			const newPage = {
				title: '',
				fields: [],
			}
			dispatch(editTemplatePageAdd({ newPage }))
			setCurrent(`${data.length}`)
		} else {
			setCurrent(`${e.key}`)
		}
	}

	const handleRemovePage = (pageIndex) => {
		dispatch(editTemplatePageRemove({ pageIndex }))

		if (pageIndex === 0) {
			setCurrent(`${pageIndex}`)
		} else {
			setCurrent(`${pageIndex - 1}`)
		}
	}
	return (
		<>
			<Menu onClick={handleNav} mode="horizontal" selectedKeys={[current]}>
				{data.map((page, index) => (
					<Menu.Item key={`${index}`}>Página {index + 1}</Menu.Item>
				))}
				<Menu.Item key="+">
					<PlusOutlined />
				</Menu.Item>
			</Menu>
			{!data.length ? (
				<Empty description="Sem Páginas" style={{ marginTop: '3rem' }} />
			) : (
				<Page
					pageIndex={parseInt(current)}
					data={data[current]}
					handleRemovePage={handleRemovePage}
				/>
			)}
		</>
	)
}

export default TemplateForm

TemplateForm.propTypes = {
	data: array,
}
