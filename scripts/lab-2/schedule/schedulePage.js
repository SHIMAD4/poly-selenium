const { By, until } = require('selenium-webdriver')

class SchedulePage {
    constructor(driver) {
        this.driver = driver
        this.url = 'https://mospolytech.ru/'
        this.scheduleButtonLocator = By.xpath("//a[@class='user-nav__item-link' and @title='Расписание']")
        this.viewOnSiteButtonLocator = By.xpath("//a[@href='https://rasp.dmami.ru/' and @class='btn text-button']")
        this.searchInputLocator = By.xpath("//input[@class='groups']")
        this.searchResultLocator = By.xpath("//div[@id='221-322']")
        this.highlightedDayLocator = By.xpath("//div[contains(@class, 'schedule-day_today')]")
    }

    async open() {
        await this.driver.get(this.url)
        await this.driver.manage().window().maximize()
    }

    async clickScheduleButton() {
        await this.driver.wait(until.elementLocated(this.scheduleButtonLocator), 5000)
        await this.driver.findElement(this.scheduleButtonLocator).click()
    }

    async clickViewOnSiteButton() {
        await this.driver.wait(until.elementLocated(this.viewOnSiteButtonLocator), 5000)
        await this.driver.findElement(this.viewOnSiteButtonLocator).click()
    }

    async enterGroupNumber(groupNumber) {
        await this.driver.wait(until.elementLocated(this.searchInputLocator), 5000)
        await this.driver.findElement(this.searchInputLocator).sendKeys(groupNumber)
        await this.driver.sleep(1000)
    }

    async clickSearchResult() {
        await this.driver.wait(until.elementLocated(this.searchResultLocator), 5000)
        await this.driver.findElement(this.searchResultLocator).click()
    }

    async isCurrentDayHighlighted() {
        let highlightedDay = await this.driver.findElement(this.highlightedDayLocator)
        return highlightedDay.isDisplayed()
    }

    async getHighlightedDaySchedule() {
        let highlightedDay = await this.driver.findElement(this.highlightedDayLocator)
        let dayTitle = await highlightedDay.findElement(By.xpath(".//div[@class='bold schedule-day__title']")).getText()
        let schedulePairs = await highlightedDay.findElements(By.xpath(".//div[@class='pair']"))

        let schedule = []
        for (let pair of schedulePairs) {
            let time = await pair.findElement(By.xpath(".//div[@class='time']")).getText()
            let lessons = await pair.findElements(By.xpath(".//div[@class='schedule-lesson']"))

            let lessonsInfo = []
            for (let lesson of lessons) {
                let auditory = await lesson.findElement(By.xpath(".//div[@class='schedule-auditory']")).getText()
                let lessonName = await lesson.findElement(By.xpath(".//div[@class='bold small']")).getText()
                let teacher = await lesson.findElement(By.xpath(".//div[@class='teacher small']/span")).getText()
                let dates = await lesson.findElement(By.xpath(".//div[@class='schedule-dates']")).getText()

                lessonsInfo.push({
                    auditory,
                    lessonName,
                    teacher,
                    dates
                })
            }
            schedule.push({ time, lessons: lessonsInfo })
        }

        return { dayTitle, schedule }
    }
}

module.exports = SchedulePage
