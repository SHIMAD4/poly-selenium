const assert = require('assert')
const { Builder, Browser, By, until } = require('selenium-webdriver')

let driver = new Builder().forBrowser(Browser.CHROME).build()

let total = 5
let remaining = 5

async function getRemainingText() {
    let remainingElem = await driver.findElement(By.xpath("//span[@class='ng-binding']"))
    return remainingElem.getText()
}

async function verifyRemainingText(expectedRemaining, expectedTotal) {
    let text = await getRemainingText()
    let expectedText = `${expectedRemaining} of ${expectedTotal} remaining`
    assert.equal(text, expectedText, "Текст оставшихся элементов не совпадает")
}

async function checkItemClass(index, expectedClass) {
    let item = await driver.findElement(By.xpath(`//input[@name='li${index}']/following-sibling::span`))
    let itemClass = await item.getAttribute("class")
    assert.equal(itemClass, expectedClass, `Элемент ${index} имеет класс ${itemClass}, а ожидался ${expectedClass}`)
}

async function clickItem(index) {
    await driver.findElement(By.name("li" + index)).click()
}

async function addItem(text) {
    await driver.findElement(By.id("sampletodotext")).sendKeys(text)
    await driver.findElement(By.id("addbutton")).click()
}

async function lambdaTest() {
    try {
        await driver.get('https://lambdatest.github.io/sample-todo-app/')
        await driver.manage().window().maximize()

        // Шаг 1: Проверка на title
        await driver.wait(until.elementLocated(By.css('h2')))
        let title = await driver.findElement(By.css('h2'))
        let isTitleDisplayed = await title.isDisplayed()
        assert.ok(isTitleDisplayed, "Заголовок не отображается")

        await driver.sleep(1000)

        for (let i = 1; i <= total; i++) {
            // Шаг 2: Проверка на remainingText
            await verifyRemainingText(remaining, total)

            // Шаг 3: Проверка на не зачеркнутые элементы
            await checkItemClass(i, "done-false")

            // Сохранение предыдущего значения remaining
            let previousRemaining = remaining

            // Шаг 4: Простановка галочки
            await clickItem(i)
            remaining--

            await driver.sleep(1000)

            // Проверка, что элемент стал зачеркнутым
            await checkItemClass(i, "done-true")

            // Проверка обновленного текста оставшихся элементов
            await verifyRemainingText(remaining, total)

            // Проверка, что remaining уменьшилось на 1
            assert.equal(remaining, previousRemaining - 1, "Количество оставшихся элементов не уменьшилось на 1")
        }

        // Сохранение предыдущих значений перед добавлением нового элемента
        let previousTotal = total
        let previousRemaining = remaining

        // Шаг 6: Добавить новый элемент списка
        await addItem("New Item")
        total++
        remaining++

        await driver.sleep(1000)

        // Проверка нового элемента
        await checkItemClass(6, "done-false")

        // Проверка увеличения remaining и total на 1
        await verifyRemainingText(remaining, total)
        assert.equal(remaining, previousRemaining + 1, "Количество оставшихся элементов не увеличилось на 1 после добавления нового элемента")
        assert.equal(total, previousTotal + 1, "Общее количество элементов не увеличилось на 1 после добавления нового элемента")

        // Шаг 7: Нажать на новый элемент списка
        await clickItem(6)
        remaining--

        await driver.sleep(1000)

        // Проверка, что новый элемент стал зачеркнутым
        await checkItemClass(6, "done-true")

        // Проверка обновленного текста оставшихся элементов
        await verifyRemainingText(remaining, total)
        assert.equal(remaining, previousRemaining, "Количество оставшихся элементов не уменьшилось на 1 после зачёркивания нового элемента")

        await driver.sleep(3000)
    } catch (err) {
        await driver.takeScreenshot().then(function (image) {
            require("fs").writeFileSync("screenshot_error.png", image, 'base64')
        })
        console.error('Тест упал по причине ошибки: %s', err)
    } finally {
        await driver.quit()
    }
}

lambdaTest()
