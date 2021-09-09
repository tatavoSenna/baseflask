const puppeteer = require('puppeteer')
const { QueryHandler } = require('query-selector-shadow-dom/plugins/puppeteer')
const expect = require('chai').expect

describe('First Lawing Puppeteer Test', () => {
	let browser
	let page
	let docRow
	let menuItem

	it('Configuration of the test environment', async function () {
		browser = await puppeteer.launch({
			headless: false,
		})
		page = await browser.newPage()
	})

	it('launch the lawing page', async function () {
		await page.goto('http://localhost:3000/')
	})

	it('login the lawing page failing', async function () {
		await puppeteer.registerCustomQueryHandler('shadow', QueryHandler)
		await page.waitForSelector('shadow/#username')
		await page.type('shadow/#username', 'yurilemos98@hotmail.com')
		await page.type('shadow/#password', 'Yuri')
		await page.keyboard.press('Enter')
		await page.waitForSelector('shadow/#username')
	})

	it('login the lawing page success', async function () {
		await page.reload()
		await page.waitForSelector('shadow/#username')
		await page.type('shadow/#username', 'yurilemos98@hotmail.com')
		await page.type('shadow/#password', 'Yuri121998')
		await page.keyboard.press('Enter')
	})

	it('check if there are documents', async function () {
		await page.waitForSelector('.ant-table-row')
		docRow = await page.$$('.ant-table-row')
	})

	it('Go to template page and create a template', async function () {
		await page.waitForSelector('.ant-menu-item')
		menuItem = await page.$$('.ant-menu-item')
		await menuItem[2].click()
		await page.waitForSelector('.ant-btn-primary')
		const btnNovoTemp = await page.$$('.ant-btn-primary')
		await btnNovoTemp[1].click()
		await page.type('#title', 'puppeteer test')
	})

	it('close browser', async function () {
		//await browser.close()
	})
})
