const assert = require('assert')
const { Builder, Browser } = require('selenium-webdriver')
const SchedulePage = require('./schedulePage')
const fs = require('fs')

describe('Тесты Расписания', function() {
    this.timeout(30000)
    let driver
    let schedulePage

    before(async () => {
        driver = new Builder().forBrowser(Browser.CHROME).build()
        schedulePage = new SchedulePage(driver)
        await schedulePage.open()
    })

    after(async () => {
        await driver.quit()
    })

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            let testName = this.currentTest.title.replace(/\s+/g, '_')
            let date = new Date().toISOString().replace(/:/g, '-')
            let screenshotName = `${testName}_${date}.png`
            let image = await driver.takeScreenshot()
            fs.writeFileSync(screenshotName, image, 'base64')
        }
    })

    it('должен перейти на страницу расписания', async () => {
        await schedulePage.clickScheduleButton()
        await driver.sleep(1000)
    })

    it('должен открыть расписание на сайте в новой вкладке', async () => {
        await schedulePage.clickViewOnSiteButton()
        await driver.sleep(1000)

        let handles = await driver.getAllWindowHandles()
        assert.equal(handles.length, 2, "Ожидалось, что будет открыта новая вкладка")
        await driver.switchTo().window(handles[1])
    })

    it('должен ввести номер группы и отобразить результаты поиска', async () => {
        await schedulePage.enterGroupNumber('221-322')
        await driver.sleep(1000)

        let searchResult = await driver.findElement(schedulePage.searchResultLocator)
        let resultText = await searchResult.getText()
        assert.ok(resultText.includes('221-322'), "В результатах поиска не отображается искомая группа")
    })

    it('должен открыть страницу расписания выбранной группы', async () => {
        await schedulePage.clickSearchResult()
        await driver.sleep(3000)
    })
})
