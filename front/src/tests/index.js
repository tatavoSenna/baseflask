const puppeteer = require('puppeteer')
const { QueryHandler } = require('query-selector-shadow-dom/plugins/puppeteer')(
	async () => {
		await puppeteer.registerCustomQueryHandler('shadow', QueryHandler)
		const browser = await puppeteer.launch({
			ignoreDefaultArgs: ['--disable-extensions'],
			headless: false,
			devtools: false,
		})
		const page = await browser.newPage()
		await page.goto('http://localhost:3000/')

		await page.waitForSelector('shadow/#username')
		await page.type('shadow/#username', 'yurilemos98@hotmail.com')
		await page.type('shadow/#password', 'Yuri')
		await page.keyboard.press('Enter')
		await page.waitforSelector('.ant-table-row.ant-table-row-level-0')
		const grabDocuments = await page.evaluate(() => {
			const documentsTags = document.querySelectorAll(
				'.ant-table-row.ant-table-row-level-0'
			)
			const documents = []
			documentsTags.forEach(element => {
				documents.push(element.innerHTML)
			})
			return documents
		})

		await console.log(grabDocuments)

		await browser.close()
	}
)()
