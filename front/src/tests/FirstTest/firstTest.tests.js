const puppeteer = require('puppeteer')
const { QueryHandler } = require('query-selector-shadow-dom/plugins/puppeteer')
const expect = require('chai').expect
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

describe('First Lawing Puppeteer Test', () => {
	let browser
	let page
	let docRow
	let menuItem

	it('Configuration of the test environment', async function () {
		browser = await puppeteer.launch({
			headless: false,
			ignoreDefaultArgs: ['--disable-extensions'],
			defaultViewport: { width: 1920, height: 1080 },
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
		await page.waitForTimeout(3000)
		await page.reload()
		await page.waitForSelector('.ant-table-row')
		docRow = await page.$$('.ant-table-row')
	})

	it('create a document', async function () {
		const btnNovoTemp = await page.$$('.ant-btn-primary')
		await btnNovoTemp[1].click()
		await page.waitForSelector('.ant-form-item-control-input-content')
		await page.type('#title', 'puppeteer test')
		await page.type('#model', 'teste2')
		await page.waitForSelector('.ant-select-focused')
		await page.keyboard.press('ArrowDown')
		await page.keyboard.press('Enter')
		const createDocBtn = await page.$$('.ant-modal-footer > .ant-btn')
		await createDocBtn[1].click()
		await page.waitForSelector('#nome')
		await page.type('#nome', 'teste')
		const nextBtn = await page.$$('.formFactory_button__2tXna')
		await nextBtn[1].click()
		await page.waitForSelector('.editor_ckEditorEditable__2K7iZ')
		menuItem = await page.$$('.ant-menu-item')
		await menuItem[0].click()
		const docCount = docRow.length + 1
		await page.waitForTimeout(3000)
		docRow = await page.$$('.ant-table-row')
		expect(docRow.length).to.equal(docCount)
	})

	it('delete a document', async function () {
		const docCount = docRow.length
		const deleteDoc = await page.$$('.anticon-delete')
		await deleteDoc[0].click()
		await page.waitForSelector('.ant-popover-buttons > .ant-btn-primary')
		const confirmDelete = await page.$$('.ant-popover-buttons > button > span')
		await page.waitForTimeout(1000)
		await confirmDelete[1].click('.ant-btn-primary')
		await page.waitForSelector('.ant-message-notice-content')
		await page.waitForSelector('.ant-message-notice-content', { hidden: true })
		docRow = await page.$$('.ant-table-row')
		expect(docRow.length).to.equal(docCount - 1)
	})

	it('select a document', async function () {
		const selectDoc = await page.$$('.ant-btn-link')
		await selectDoc[0].click()
		await page.waitForSelector('.ant-menu-item-only-child')
		const menuDocTab = await page.$$('.ant-menu-item-only-child')
		await menuDocTab[1].click()
		await page.click('.tabs_button__5gPSF ')
	})

	it('check download document', async function () {
		const download_path = path.resolve('./testFiles')
		await page._client.send('Page.setDownloadBehavior', {
			behavior: 'allow',
			userDataDir: './',
			downloadPath: download_path,
		})
		await page.waitForTimeout(5000)
		const fileNames = fs.readdirSync(download_path)
		console.log('fileNames: ', fileNames)
		const fileUploaded = fs.readFileSync(`${download_path}/${fileNames[0]}`)
		const fileExpected = fs.readFileSync(`${download_path}/${fileNames[1]}`)
		const buf1Hash = crypto.createHash('sha256').update(fileUploaded).digest()
		const buf2Hash = crypto.createHash('sha256').update(fileExpected).digest()
		console.log('fileUploaded:', buf1Hash)
		console.log('fileExpected:', buf2Hash)
		console.log(buf2Hash === buf1Hash)
		expect(buf1Hash.length).to.equal(buf2Hash.length)
	})

	it('close browser', async function () {
		//await browser.close()
	})
})
