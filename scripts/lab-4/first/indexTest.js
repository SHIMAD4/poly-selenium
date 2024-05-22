const { allure } = require("allure-mocha/runtime")
const { Builder, Browser } = require('selenium-webdriver')
const { afterEach } = require('mocha')
const StorePage = require('./indexPage')
const fs = require('fs')
const path = require('path')

describe('Тесты Магазина', function() {
    this.timeout(60000)
    let driver
    let storePage
    let logs = []

    function logStep(message) {
        logs.push(message)
        console.log(message)
    }

    async function takeScreenshot(testName) {
        const date = new Date().toISOString().replace(/:/g, '-')
        const screenshotDir = "screenshots"
        const screenshotPath = path.join(screenshotDir, `${testName}_${date}.png`)
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir)
        }
        const image = await driver.takeScreenshot()
        fs.writeFileSync(screenshotPath, image, 'base64')
        logStep(`Screenshot saved to: ${screenshotPath}`)
        allure.attachment("Screenshot", fs.readFileSync(screenshotPath), "image/png")
    }

    before(async () => {
        driver = await new Builder().forBrowser(Browser.CHROME).build()
        storePage = new StorePage(driver)
        await storePage.open()
    })

    after(async () => {
        if (driver) {
            await driver.quit()
        }
    })

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            await takeScreenshot(this.currentTest.title.replace(/\s+/g, '_'))
            allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain")
        }
    })

    it('Должен перейти на страницу электрогитар', async () => {
        await allure.step("Шаг 1. Перешел на страницу категорий", async () => {
            try {
                await storePage.clickCategoryButton()
                logStep("Перешел на страницу категорий")
                allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain")
            } catch (error) {
                logStep(`Error: ${error}`)
                await takeScreenshot(this.test.title.replace(/\s+/g, '_'))
                await allure.step("Step failed", {}, async () => {
                    throw error
                })
            }
            await driver.sleep(1000)
        })

        await allure.step("Шаг 2. Перешел на страницу электрогитар", async () => {
            try {
                await storePage.clickSubCategoryButton()
                logStep("Перешел на страницу электрогитар")
                allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain")
            } catch (error) {
                logStep(`Error: ${error}`)
                await takeScreenshot(this.test.title.replace(/\s+/g, '_'))
                await allure.step("Step failed", {}, async () => {
                    throw error
                })
            }
            await driver.sleep(1000)
        })
    })

    it('Должен выбрать фильтрация', async () => {
        await allure.step("Шаг 3. Тег выключен", async () => {
            try {
                await storePage.clickRandomTag()
                logStep("Тег выключен")
                allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain")
            } catch (error) {
                logStep(`Error: ${error}`)
                await takeScreenshot(this.test.title.replace(/\s+/g, '_'))
                await allure.step("Step failed", {}, async () => {
                    throw error
                })
            }
            await driver.sleep(4000)
        })

        await allure.step("Шаг 4. Выбран фильтр", async () => {
            try {
                await storePage.disableTag()
                logStep("Выбран фильтр")
                allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain")
            } catch (error) {
                logStep(`Error: ${error}`)
                await takeScreenshot(this.test.title.replace(/\s+/g, '_'))
                await allure.step("Step failed", {}, async () => {
                    throw error
                })
            }
            await driver.sleep(4000)
        })
    })

    it('Должен добавить в корзину товар', async () => {
        await allure.step("Шаг 5. Выбран первый товар", async () => {
            try {
                await storePage.clickFirstProduct()
                logStep("Выбран первый товар")
                allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain")
            } catch (error) {
                logStep(`Error: ${error}`)
                await takeScreenshot(this.test.title.replace(/\s+/g, '_'))
                await allure.step("Step failed", {}, async () => {
                    throw error
                })
            }
            await driver.sleep(4000)
        })

        await allure.step("Шаг 6. Товар добавлен в корзину", async () => {
            try {
                await storePage.addToCard()
                logStep("Товар добавлен в корзину")
                allure.attachment("Log", Buffer.from(logs.join("\n")), "text/plain")
            } catch (error) {
                logStep(`Error: ${error}`)
                await takeScreenshot(this.test.title.replace(/\s+/g, '_'))
                await allure.step("Step failed", {}, async () => {
                    throw error
                })
            }
            await driver.sleep(4000)
        })
    })
})
