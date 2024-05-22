const { By, until } = require('selenium-webdriver');

class StorePage {
    constructor(driver) {
        this.driver = driver;
        this.url = 'https://www.muztorg.ru/';
        this.categoryButton = By.xpath("//div[@class='catalog-menu__i ']//a[@href='/category/gitary']");
        this.subCategoryButton = By.xpath("//div[@title='Акустические гитары']/..");
        this.minInput = By.xpath('//div[@class="range-slider__inputs"]/input[1]');
        this.maxInput = By.xpath('//div[@class="range-slider__inputs"]/input[2]');
        this.applyButton = By.xpath('//div[@class="catalog-filter__ear"]//button[starts-with(text(),"Применить")]');
        this.addToCardButton = By.xpath('//a[contains(@class, "btn-product-orange")]');
    }

    async open() {
        await this.driver.get(this.url);
        await this.driver.manage().window().maximize();
        await this.driver.sleep(5000);
    }

    async clickCategoryButton() {
        await this.driver.wait(until.elementLocated(this.categoryButton), 3000);
        await this.driver.findElement(this.categoryButton).click();
    }

    async clickSubCategoryButton() {
        await this.driver.wait(until.elementLocated(this.subCategoryButton), 5000);
        await this.driver.findElement(this.subCategoryButton).click();
    }

    async setRandomPrice(min = 7409, max = 1655000) {
        const randomMin = Math.floor(Math.random() * (max - min + 1)) + min;
        const randomMax = Math.floor(Math.random() * (max - randomMin + 1)) + randomMin;

        await this.setMinPrice(randomMin);
        await this.setMaxPrice(randomMax);
    }

    async setMinPrice(value) {
        await this.driver.wait(until.elementLocated(this.minInput), 3000);
        const minElement = await this.driver.findElement(this.minInput);
        await minElement.clear();
        await minElement.sendKeys(value.toString());
    }

    async setMaxPrice(value) {
        await this.driver.wait(until.elementLocated(this.maxInput), 3000);
        const maxElement = await this.driver.findElement(this.maxInput);
        await maxElement.clear();
        await maxElement.sendKeys(value.toString());
    }

    async clickApplyButton() {
        await this.driver.wait(until.elementLocated(this.applyButton), 3000);
        const applyButton = await this.driver.findElement(this.applyButton);
        await this.driver.wait(until.elementIsVisible(applyButton), 3000);
        await applyButton.click();
    }

    async clickFirstProduct() {
        const firstProduct = await this.driver.findElement(By.css('.product-thumbnail'));

        const priceElement = await firstProduct.findElement(By.css('.product-price .price'));
        const priceText = await priceElement.getText();

        const nameElement = await firstProduct.findElement(By.css('.product-header .title a'));
        const nameText = await nameElement.getText();

        await firstProduct.click();

        return { price: priceText, name: nameText };
    }

    async addToCard() {
        const addToCardButton = await this.driver.findElement(this.addToCardButton);
        await this.driver.wait(until.elementIsVisible(addToCardButton), 5000);
        await addToCardButton.click();
    }
}

module.exports = StorePage;
