import React, { useState } from 'react'
import { string, shape, arrayOf, array, number, func, bool } from 'prop-types'
import { Table, Input, Button, Empty } from 'antd'

const { Search } = Input

const DataTable = ({
	columns,
	dataSource,
	pages,
	onChangePageNumber,
	placeholderSearch,
	textButton,
	onSearch,
	onClickButton,
	placeholderNoData,
	loading,
	onClickRow,
	buttons,
}) => {
	const [search, setSearch] = useState('')
	return (
		<>
			<div
				className="searchbox"
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					gap: '5px',
					margin: '24px 0',
				}}>
				<Search
					placeholder={placeholderSearch}
					onSearch={(search) => onSearch({ page: 1, perPage: 10, search })}
					onChange={(e) => setSearch(e.target.value)}
					enterButton
					style={{ width: '50%' }}
				/>
				<Button onClick={onClickButton}>{textButton}</Button>
				{buttons.map((button, index) => (
					<Button key={index} onClick={button.onClick}>
						{button.title}
					</Button>
				))}
			</div>
			<Table
				columns={columns}
				dataSource={dataSource}
				onRow={(record, rowIndex) => {
					return {
						onClick: () => onClickRow(record, rowIndex),
					}
				}}
				pagination={{
					showSizeChanger: true,
					pageSize: pages.per_page,
					position: ['bottomCenter'],
					total: pages.total,
					current: pages.page,
					onShowSizeChange: (page, perPage) =>
						onChangePageNumber({ page, perPage, search }),
					onChange: (page, perPage) =>
						onChangePageNumber({ page, perPage, search }),
					locale: { items_per_page: '' },
				}}
				locale={{ emptyText: <Empty description={placeholderNoData} /> }}
				loading={loading}
			/>
		</>
	)
}

DataTable.propTypes = {
	columns: arrayOf(
		shape({
			title: string,
			dataIndex: string,
		})
	).isRequired,
	dataSource: array.isRequired,
	pages: shape({
		per_page: number,
		page: number,
		total: number,
	}).isRequired,
	onChangePageNumber: func.isRequired,
	placeholderSearch: string,
	textButton: string.isRequired,
	onSearch: func.isRequired,
	onClickButton: func.isRequired,
	placeholderNoData: string,
	loading: bool,
	onClickRow: func,
	buttons: array,
}

DataTable.defaultProps = {
	placeholderSearch: 'Search',
	placeholderNoData: 'Nenhum dado encontrado',
	loading: false,
	onClickRow: () => {},
	buttons: [],
}

export default DataTable
