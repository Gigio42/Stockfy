const { Builder, By, Key, until } = require('selenium-webdriver');

async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('https://stockfysite.onrender.com/login/login.html');
    await driver.findElement(By.id('username')).sendKeys('fulano');
    await driver.findElement(By.id('password')).sendKeys('fulano');
    await driver.findElement(By.id('login')).click();
    await driver.wait(until.elementLocated(By.linkText('Compras')), 10000);
    await driver.findElement(By.linkText('Compras')).click();
    await driver.findElement(By.id('fornecedor')).click();
    await driver.findElement(By.css('#fornecedor > option:nth-child(5)')).click();
    let customerNumberElement = await driver.wait(until.elementIsVisible(driver.findElement(By.id('customerNumber'))), 10000);
    await driver.wait(until.elementIsEnabled(customerNumberElement), 10000);
    await driver.executeScript("arguments[0].value = '999';", customerNumberElement);
    await driver.findElement(By.id('quantity')).sendKeys('200');
    await driver.findElement(By.id('quality')).sendKeys('SEL');
    await driver.findElement(By.id('wave')).sendKeys('B');
    await driver.findElement(By.id('weight')).sendKeys('99');
    await driver.findElement(By.id('totalWeight')).sendKeys('99');
    await driver.findElement(By.id('unitPrice')).sendKeys('99');
    await driver.findElement(By.id('totalPrice')).sendKeys('99');
    await driver.findElement(By.id('width')).sendKeys('200');
    await driver.findElement(By.id('length')).sendKeys('200');
    await driver.findElement(By.id('creases')).sendKeys('não');
    await driver.findElement(By.id('buyer')).sendKeys('Selenium');
    await driver.findElement(By.id('purchaseDate')).sendKeys('2024-06-08');
    await driver.findElement(By.id('supplier')).sendKeys('SeleniumSupplyer');
    await driver.findElement(By.id('purchaseID')).sendKeys('99999');
    await driver.findElement(By.id('addPlateButton')).click();
    await driver.findElement(By.id('expectedDateManual')).sendKeys('17/06');
    await driver.findElement(By.id('sendbutton')).click();
    await driver.findElement(By.id('sendbutton')).click();
    await driver.findElement(By.id('sendbutton')).click();
  } finally {
    await driver.quit();
  }
}

example();