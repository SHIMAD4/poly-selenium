const { By, until } = require('selenium-webdriver');

class MarketPage {
    constructor(driver) {
        this.driver = driver;
        this.url = 'https://market.yandex.ru';
        this.productTitlesLocator = By.xpath("//h3[@role='link' and @data-auto='snippet-title']");
        this.productPricesLocator = By.xpath("//span[@aria-hidden='true' and @data-auto='snippet-price-current' and .//span[text()='₽']]");
        this.addToCartButtonLocator = By.xpath("//button[@aria-label='В корзину' and @data-auto='cartButton']");
        this.cartButtonLocator = By.xpath("//*[@id=\"CART_ENTRY_POINT_ANCHOR\"]/a");
        this.cartItemLocator = By.xpath('//div[@data-apiary-widget-name="@chef/cart/CartItem"]');
        this.incrementButtonLocator = By.xpath("//*[@data-auto=\'offerAmountPlus\']");
        this.removeButtonLocator = By.xpath("//*[@data-auto=\'remove-button\']");
    }

    async open() {
        await this.driver.get(this.url);
        await this.driver.manage().window().maximize();
        await this.driver.sleep(10000)
    }

    async waitUntil(condituion) {
        await this.driver.wait(condituion)
    }

    async click(locator) {
        await this.driver.findElement(locator).click();
    }

    async waitElementLocated(locator) {
        await this.waitUntil(until.elementLocated(locator))
    }

    async getTextOfElement(locator) {
        return await this.driver.findElement(locator).getText()
    }

    async sleep(milliseconds) {
        await this.driver.sleep(milliseconds * 3)
    }

    get CatalogButton() {
        return By.xpath(`//button/span[text()="Каталог"]/..`)
    }

    get LinkInUl() {
        return By.xpath(`//li/a//span[text() = "Ноутбуки и компьютеры"]/../../../li[position() = 5]`)
    }

    get LaptopAndComputerLink() {
        return By.xpath(`//li/a//span[text() = "Ноутбуки и компьютеры"]/../..`)
    }

    get LaptopLink() {
        return By.xpath(`//div[@data-baobab-name="new-category-snippet"]//h3/following-sibling::div//div[text() = "Ноутбуки"]/ancestor::a`)
    }

    async getHeaderFromProductCardByID(id=1) {
        return By.xpath(`//div[@data-auto="SerpList"]/div[@data-apiary-widget-name="@marketfront/SerpEntity" and position() = ${id+1}]//h3`)
    }

    async getPriceFromProductCardByID(id=1) {
        return By.xpath(`//div[@data-auto="SerpList"]/div[@data-apiary-widget-name="@marketfront/SerpEntity" and position() = ${id+1}]//div[@data-baobab-name="price"]//span[@data-auto="snippet-price-current"]/span[@class="_1ArMm"]`)
    }

    async getFirstFiveProducts() {
        await this.driver.wait(until.elementsLocated(this.productTitlesLocator), 5000);
        await this.driver.wait(until.elementsLocated(this.productPricesLocator), 5000);

        const productTitles = await this.driver.findElements(this.productTitlesLocator);
        const productPrices = await this.driver.findElements(this.productPricesLocator);

        let products = [];

        for (let i = 0; i < 5; i++) {
            let title = await productTitles[i].getText();
            let price = await productPrices[i].getText();
            products.push({ title, price });
        }

        return products;
    }

    async addToCart(index) {
        await this.driver.wait(until.elementsLocated(this.addToCartButtonLocator), 5000);
        const addToCartButtons = await this.driver.findElements(this.addToCartButtonLocator);
        await addToCartButtons[index].click();
    }

    async goToCart() {
        await this.driver.wait(until.elementIsVisible(this.driver.findElement(this.cartButtonLocator)), 5000);
        await this.driver.wait(until.elementLocated(this.cartButtonLocator), 5000).click();

        await this.driver.wait(until.elementIsVisible(this.driver.findElement(this.cartItemLocator)), 10000);
        await this.driver.findElement(this.cartItemLocator);
    }

    async getCartItemDetails() {
        await this.driver.wait(until.elementLocated(this.cartItemLocator), 5000);

        let title = await this.driver.findElement(By.xpath('//div[@class=\'_1eJOk\']//h3[@class=\'_3YHut _2SUA6 _33utW _13aK2 _1A5yJ\']/a')).getText();
        let priceText = await this.driver.findElement(By.xpath('//*[@data-auto=\'total-price\']')).getText();
        let price = priceText.replace(/[^\d]/g, "");

        return { title, price };
    }

    async incrementCartItem() {
        await this.driver.wait(until.elementLocated(this.incrementButtonLocator), 5000);
        let incrementButton = await this.driver.findElement(this.incrementButtonLocator);
        let isEnabled = await incrementButton.isEnabled();

        if (isEnabled) {
            await incrementButton.click();
        } else {
            console.log('Кнопка увеличения товара выключена.');
        }
    }

    async removeCartItem() {
        await this.driver.wait(until.elementIsVisible(this.driver.findElement(this.removeButtonLocator)), 5000);
        await this.driver.findElement(this.removeButtonLocator).click();
    }

    async getEmptyCartMessage() {
        return await this.driver.findElement(By.xpath("//div[@data-zone-name=\"emptyCartLoginButton\"]")).getText();
    }
}

module.exports = MarketPage;
