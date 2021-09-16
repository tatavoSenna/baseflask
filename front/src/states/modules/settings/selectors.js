export const selectAllWebhooks = (payload) =>
	payload.map((webhook) => {
		return {
			id: webhook.id.toString(),
			key: webhook.id.toString(),
			webhook: webhook.webhook,
			docx: webhook.docx,
			pdf: webhook.pdf,
		}
	})
