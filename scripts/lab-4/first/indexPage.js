const { By, until } = require('selenium-webdriver')

class StorePage {
    constructor(driver) {
        this.driver = driver
        this.url = 'https://www.muztorg.ru/'
        this.categoryButton = By.xpath("//div[@class='catalog-menu__i ']//a[@href='/category/gitary']")
        this.subCategoryButton = By.xpath("//div[@title='Электрогитары']/..")
        this.tag = By.css('.seo-tags__slider__link')
        this.label = By.css('.catalog-top-filter label[for]')
        this.addToCardButton = By.xpath('//a[contains(@class, "btn-product-orange")]')
    }

    async open() {
        await this.driver.get(this.url)
        await this.driver.manage().window().maximize()
        await this.driver.sleep(5000);
    }

    async clickCategoryButton() {
        await this.driver.wait(until.elementLocated(this.categoryButton), 3000)
        await this.driver.findElement(this.categoryButton).click()
    }

    async clickSubCategoryButton() {
        await this.driver.wait(until.elementLocated(this.subCategoryButton), 5000)
        await this.driver.findElement(this.subCategoryButton).click()
    }

    async clickRandomTag() {
        const elements = await this.driver.findElements(this.tag);
        const visibleElements = [];

        for (const element of elements) {
            if (await element.isDisplayed()) {
                visibleElements.push(element);
            }
        }

        if (visibleElements.length === 0) {
            throw new Error('No visible tags found');
        }

        const randomIndex = Math.floor(Math.random() * visibleElements.length);
        const randomElement = visibleElements[randomIndex];

        const selectedTag = await randomElement.getText();

        await randomElement.click();

        return selectedTag;
    }

    async disableTag() {
        const labels = await this.driver.findElements(this.label);
        const randomIndex = Math.floor(Math.random() * labels.length);
        const randomLabel = labels[randomIndex];

        const selectedFilter = await randomLabel.getText();

        if (selectedFilter.includes("Под заказ")) {
            const isChecked = await this.isCheckboxChecked(randomLabel);
            if (isChecked) {
                await this.clickLabel(randomLabel);
            }
        } else if (selectedFilter.includes("В наличии")) {
            const isChecked = await this.isCheckboxChecked(randomLabel);
            if (!isChecked) {
                await this.clickLabel(randomLabel);
            }
        }

        return selectedFilter;
    }

    async isCheckboxChecked(labelElement) {
        const checkbox = await labelElement.findElement(By.xpath("./preceding-sibling::input"));
        return await checkbox.isSelected();
    }

    async clickLabel(labelElement) {
        await labelElement.click();
    }

    async clickFirstProduct() {
        const firstProduct = await this.driver.findElement(By.css('.product-thumbnail'));

        const priceElement = await firstProduct.findElement(By.css('.product-price .price'));
        const priceText = await priceElement.getText();

        const nameElement = await firstProduct.findElement(By.css('.product-header .title a'));
        const nameText = await nameElement.getText();

        await firstProduct.click()

        return { price: priceText, name: nameText };
    }

    async addToCard() {
        const addToCardButton = await this.driver.findElement(this.addToCardButton);
        await this.driver.wait(until.elementIsVisible(addToCardButton), 5000);
        await addToCardButton.click();
    }
}

module.exports = StorePage
