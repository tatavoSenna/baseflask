export const selectAllDocumentDetail = (payload) => {
	return {
		...payload,
		workflow: {
			...payload.workflow,
			current: payload.workflow.steps
				.map((item) => item.step)
				.indexOf(payload.workflow.current_step),
		},
	}
}
