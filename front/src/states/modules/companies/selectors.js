export const selectAllCompanies = (payload) =>
	payload.map((company) => {
		return {
			id: company.id.toString(),
			key: company.id.toString(),
			name: company.name,
			remainingDocuments: company.remaining_documents,
		}
	})
