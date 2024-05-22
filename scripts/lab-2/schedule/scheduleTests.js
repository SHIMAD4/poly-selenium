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
        if (driver) {
            await driver.quit()
        }
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
        console.log('Шаг 1. Перешел на страницу расписания')
    })

    it('должен открыть расписание на сайте в новой вкладке', async () => {
        await schedulePage.clickViewOnSiteButton()
        await driver.sleep(1000)

        let handles = await driver.getAllWindowHandles()
        assert.equal(handles.length, 2, "Ожидалось, что будет открыта новая вкладка")
        await driver.switchTo().window(handles[1])

        console.log('Шаг 2. Открыл расписание на сайте в новой вкладке')
    })

    it('должен ввести номер группы и отобразить результаты поиска', async () => {
        await schedulePage.enterGroupNumber('221-322')
        await driver.sleep(1000)

        let searchResult = await driver.findElement(schedulePage.searchResultLocator)
        let resultText = await searchResult.getText()
        assert.ok(resultText.includes('221-322'), "В результатах поиска не отображается искомая группа")

        console.log('Шаг 3. Ввел номер группы и отобразил результаты поиска')
    })

    it('должен открыть страницу расписания выбранной группы', async () => {
        await schedulePage.clickSearchResult()
        await driver.sleep(3000)

        console.log('Шаг 4. Открыл страницу расписания выбранной группы')
    })

    it('должен выделить текущий день недели в расписании', async () => {
        let isHighlighted = await schedulePage.isCurrentDayHighlighted()
        assert.ok(isHighlighted, "Текущий день недели не выделен в расписании")

        let schedule = await schedulePage.getHighlightedDaySchedule()
        console.log(`Текущий день недели: ${schedule.dayTitle}`)
        for (let pair of schedule.schedule) {
            console.log(`Время: ${pair.time}`)
            for (let lesson of pair.lessons) {
                console.log(`Аудитория: ${lesson.auditory}`)
                console.log(`Занятие: ${lesson.lessonName}`)
                console.log(`Преподаватель: ${lesson.teacher}`)
                console.log(`Даты: ${lesson.dates}`)
            }
        }

        console.log('Шаг 5. Выделил текущий день недели в расписании и вывел его в консоль')
    })
})
