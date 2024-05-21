const { By, until } = require('selenium-webdriver')

class SchedulePage {
    constructor(driver) {
        this.driver = driver
        this.url = 'https://mospolytech.ru/'
        this.scheduleButtonLocator = By.xpath("//a[@class='user-nav__item-link' and @title='Расписание']")
        this.viewOnSiteButtonLocator = By.xpath("//a[@href='https://rasp.dmami.ru/' and @class='btn text-button']")
        this.searchInputLocator = By.xpath("//input[@class='groups']")
        this.searchResultLocator = By.xpath("//div[@id='221-322']")
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
}

module.exports = SchedulePage
