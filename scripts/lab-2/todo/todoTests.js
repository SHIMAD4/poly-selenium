const assert = require('assert')
const { Builder, Browser } = require('selenium-webdriver')
const TodoPage = require('./todoPage')
const fs = require('fs')

describe('Тесты Todo App', function() {
    this.timeout(30000)
    let driver
    let todoPage

    before(async () => {
        driver = new Builder().forBrowser(Browser.CHROME).build()
        todoPage = new TodoPage(driver)
        await todoPage.open()
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

    it('должен проверить, что заголовок отображается', async () => {
        let title = await todoPage.getTitle()
        let isTitleDisplayed = await title.isDisplayed()
        assert.ok(isTitleDisplayed, "Заголовок не отображается")
        await driver.sleep(1000)
    })

    it('должен завершить существующие элементы и добавить новый элемент', async () => {
        let total = 5
        let remaining = 5

        for (let i = 1; i <= total; i++) {
            await todoPage.verifyRemainingText(remaining, total)
            await todoPage.checkItemClass(i, "done-false")

            let previousRemaining = remaining

            await todoPage.clickItem(i)
            remaining--

            await todoPage.checkItemClass(i, "done-true")
            await todoPage.verifyRemainingText(remaining, total)
            assert.equal(remaining, previousRemaining - 1, "Количество оставшихся элементов не уменьшилось на 1")

            await driver.sleep(1000)
        }

        let previousTotal = total
        let previousRemaining = remaining

        await todoPage.addItem("New Item")
        total++
        remaining++

        await todoPage.checkItemClass(6, "done-false")
        await todoPage.verifyRemainingText(remaining, total)
        assert.equal(remaining, previousRemaining + 1, "Количество оставшихся элементов не увеличилось на 1 после добавления нового элемента")
        assert.equal(total, previousTotal + 1, "Общее количество элементов не увеличилось на 1 после добавления нового элемента")

        await driver.sleep(1000)

        await todoPage.clickItem(6)
        remaining--

        await todoPage.checkItemClass(6, "done-true")
        await todoPage.verifyRemainingText(remaining, total)
        assert.equal(remaining, previousRemaining, "Количество оставшихся элементов не уменьшилось на 1 после зачёркивания нового элемента")
    })
})
