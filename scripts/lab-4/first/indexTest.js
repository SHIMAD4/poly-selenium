const { allure } = require("allure-mocha/runtime");
const { Builder, Browser } = require('selenium-webdriver')
const { afterEach } = require('mocha')
const StorePage = require('./indexPage')
const fs = require('fs')

describe('Тесты Магазина', function() {
    this.timeout(60000)
    let driver
    let storePage

    before(async () => {
        driver = new Builder().forBrowser(Browser.CHROME).build();
        storePage = new StorePage(driver);
        await storePage.open();
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
            allure.attachment(screenshotName, fs.readFileSync(screenshotName), "image/png");
        }
    })

    it('Должен перейти на страницу электрогитар', async () => {
        await allure.step("Шаг 1. Перешел на страницу категорий", async () => {
            await storePage.clickCategoryButton()
            await driver.sleep(1000)
        })
        await allure.step("Шаг 2. Перешел на страницу электрогитар", async () => {
            await storePage.clickSubCategoryButton()
            await driver.sleep(1000)
        })
    })

    it('Должен выбрать фильтрация', async () => {
        await allure.step("Шаг 3. Тег выключен", async () => {
            await storePage.clickRandomTag();
            await driver.sleep(4000);
        })
        await allure.step("Шаг 4. Выбран фильтр", async () => {
            await storePage.disableTag();
            await driver.sleep(4000);
        })
    })

    it('Должен добавить в корзину товар', async () => {
        await allure.step("Шаг 5. Выбран первый товар", async () => {
            await storePage.clickFirstProduct();
            await driver.sleep(4000);
        })
        await allure.step("Шаг 6. Товар добавлен в корзину", async () => {
            await storePage.addToCard();
            await driver.sleep(4000);
        })
    })
})
