const classNames = (...args) => {
	return args
		.map((item) => {
			if (typeof item !== 'object') return item
			return (
				item &&
				Object.entries(item)
					.filter(([, value]) => value)
					.map(([key]) => key)
					.join(' ')
			)
		})
		.join(' ')
}

export default classNames
