const assert = require('assert')
const { By } = require('selenium-webdriver')

class TodoPage {
    constructor(driver) {
        this.driver = driver
        this.url = 'https://lambdatest.github.io/sample-todo-app/'
        this.titleLocator = By.css('h2')
        this.remainingTextLocator = By.xpath("//span[@class='ng-binding']")
        this.addItemInputLocator = By.id("sampletodotext")
        this.addButtonLocator = By.id("addbutton")
    }

    async open() {
        await this.driver.get(this.url)
        await this.driver.manage().window().maximize()
    }

    async getTitle() {
        return await this.driver.findElement(this.titleLocator)
    }

    async getRemainingText() {
        let remainingElem = await this.driver.findElement(this.remainingTextLocator)
        return await remainingElem.getText()
    }

    async verifyRemainingText(expectedRemaining, expectedTotal) {
        let text = await this.getRemainingText()
        let expectedText = `${expectedRemaining} of ${expectedTotal} remaining`
        assert.equal(text, expectedText, "Текст оставшихся элементов не совпадает")
    }

    async checkItemClass(index, expectedClass) {
        let item = await this.driver.findElement(By.xpath(`//input[@name='li${index}']/following-sibling::span`))
        let itemClass = await item.getAttribute("class")
        assert.equal(itemClass, expectedClass, `Элемент ${index} имеет класс ${itemClass}, а ожидался ${expectedClass}`)
    }

    async clickItem(index) {
        await this.driver.findElement(By.name("li" + index)).click()
    }

    async addItem(text) {
        await this.driver.findElement(this.addItemInputLocator).sendKeys(text)
        await this.driver.findElement(this.addButtonLocator).click()
    }
}

module.exports = TodoPage
