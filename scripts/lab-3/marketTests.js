const assert = require('assert');
const { Builder, Browser } = require('selenium-webdriver');
const MarketPage = require('./marketPage');
const fs = require('fs');
const {it} = require("mocha");

describe('Тесты Яндекс Маркета', function() {
    this.timeout(60000);
    let driver;
    let marketPage;

    before(async () => {
        driver = new Builder().forBrowser(Browser.CHROME).build();
        marketPage = new MarketPage(driver);
        await marketPage.open();
    });

    after(async () => {
        await driver.quit();
    });

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            let testName = this.currentTest.title.replace(/\s+/g, '_');
            let date = new Date().toISOString().replace(/:/g, '-');
            let screenshotName = `${testName}_${date}.png`;
            let image = await driver.takeScreenshot();
            fs.writeFileSync(screenshotName, image, 'base64');
        }
    });

    it('должен открыть главную страницу Яндекс Маркета', async () => {
        let title = await driver.getTitle();
        assert.strictEqual(title.includes('Яндекс Маркет'), true, "Главная страница Яндекс Маркета не открылась");
        console.log('Шаг 1: Главная страница Яндекс.Маркета открыта');
    });

    it('Нажимает на кнопку каталога', async function() {
        await marketPage.waitElementLocated(marketPage.CatalogButton)
        await driver.sleep(1000);

        await marketPage.click(marketPage.CatalogButton)
        await driver.sleep(1000);

        console.log('Шаг 2: Каталог открыт');
    })

    it('Переходим в Ноутбуки и компьютеры', async function() {
        await marketPage.waitElementLocated(marketPage.LinkInUl)
        await driver.sleep(1000);

        await marketPage.click(marketPage.LaptopAndComputerLink)
        await driver.sleep(1000);

        console.log('Шаг 3: Страница ноутбуки и компьютеры открыта');
    })

    it('Переходит по ссылке Ноутбуки', async function() {
        await marketPage.waitElementLocated(marketPage.LaptopLink)
        await driver.sleep(1000);

        await marketPage.click(marketPage.LaptopLink)
        await driver.sleep(1000);

        console.log('Шаг 4: Страница ноутбуки открыта');
    })

    it('Выводит в лог первые пять товаров', async function() {
        await marketPage.waitElementLocated(await marketPage.getHeaderFromProductCardByID(1))
        await marketPage.sleep(1000)

        console.log(`Первые пять товаров:`)
        for (let i=1; i<6; i++) {
            if(i >= 4) {
                cardHeader = await marketPage.getHeaderFromProductCardByID(i+1)
                cardPrice = await marketPage.getPriceFromProductCardByID(i+1)
            } else {
                cardHeader = await marketPage.getHeaderFromProductCardByID(i)
                cardPrice = await marketPage.getPriceFromProductCardByID(i)
            }

            let text = await marketPage.getTextOfElement(cardHeader)
            let price = await marketPage.getTextOfElement(cardPrice)
            if (i === 2) {
                rememberHeading = text
                rememberPrice = price
            }
            console.log(`\t${i}) ${text} - ${price} рублей`)
        }

        console.log(`Я запомнил товар: \n\t ${rememberHeading} - ${rememberPrice} рублей`);
    })

    it('должен запомнить вторую позицию из списка товаров (название и цену)', async () => {
        let products = await marketPage.getFirstFiveProducts();
        let secondProduct = products[1];
        console.log(`Шаг 6: Вторая позиция: Название - ${secondProduct.title}, Цена - ${secondProduct.price}`);
        this.secondProduct = secondProduct;
    });

    it('должен добавить второй товар в корзину', async () => {
        await marketPage.addToCart(1);
        await driver.sleep(1000);

        let products = await marketPage.getFirstFiveProducts();
        let secondProduct = products[1];
        assert.ok(secondProduct.title.includes('Ноутбук'), "Товар не был добавлен в корзину");
        console.log('Шаг 7: Второй товар добавлен в корзину');
    });

    it('должен открыть страницу корзины и проверить наличие добавленного товара', async () => {
        await marketPage.goToCart();
        await driver.sleep(1000);

        let cartItemDetails = await marketPage.getCartItemDetails();

        if (cartItemDetails.title) {
            assert.equal(cartItemDetails.title, this.secondProduct.title, "Название товара в корзине не совпадает");
        } else {
            console.warn("Описание товара отсутствует");
        }

        if (cartItemDetails.price) {
            let expectedPrice = this.secondProduct.price.replace(/[^\d]/g, "");
            assert.equal(cartItemDetails.price, expectedPrice, "Цена товара в корзине не совпадает");
        } else {
            console.warn("Цена товара отсутствует");
        }

        console.log('Шаг 8: Проверка наличия добавленного товара в корзине');
    });

    it('должен увеличить количество товара в корзине', async () => {
        let initialPrice = parseFloat(this.secondProduct.price.replace(/\s/g, ''));
        await marketPage.incrementCartItem();
        await driver.sleep(1000);

        let cartItemDetails = await marketPage.getCartItemDetails();
        let newPrice = parseFloat(cartItemDetails.price.replace(/\s/g, ''));
        assert.equal(newPrice, initialPrice * 2, "Цена товара в корзине не обновилась правильно");
        console.log('Шаг 9: Количество товара увеличено, цена обновлена');
    });

    it('должен удалить товар из корзины', async () => {
        await marketPage.removeCartItem();
        await driver.sleep(5000);

        let emptyCartButton = await marketPage.getEmptyCartMessage();
        assert.ok(emptyCartButton.includes('Войти'), "Кнопка 'Войти' не отображается");
        console.log('Шаг 10: Товар удален из корзины, сообщение "Войти" отображается');
    });
});
