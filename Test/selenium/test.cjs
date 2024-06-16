const { Builder, By, Key, until } = require("selenium-webdriver");
const faker = require("faker");

async function example() {
  let driver = await new Builder().forBrowser("firefox").build();
  try {
    await driver.get("https://stockfysite.onrender.com/login/login.html");
    await driver.findElement(By.id("username")).sendKeys("SeleniumTestUser");
    await driver.findElement(By.id("password")).sendKeys("SeleTestUser123");
    await driver.findElement(By.id("login")).click();
    await driver.wait(until.elementLocated(By.linkText("Compras")), 10000);
    await driver.findElement(By.linkText("Compras")).click();
    await driver.findElement(By.id("fornecedor")).click();
    await driver.findElement(By.css("#fornecedor > option:nth-child(5)")).click();
    let customerNumberElement = await driver.wait(until.elementIsVisible(driver.findElement(By.id("customerNumber"))), 10000);
    await driver.wait(until.elementIsEnabled(customerNumberElement), 10000);
    await driver.executeScript("arguments[0].value = '999';", customerNumberElement);
    await driver.findElement(By.id("quantity")).sendKeys(faker.datatype.number({ min: 1, max: 4 }) * 500);
    await driver.findElement(By.id("quality")).sendKeys(faker.random.arrayElement(["KMK", "FK2", "SLL40", "DKL80", "BR11JJ", "BR11S"]));
    await driver.findElement(By.id("wave")).sendKeys(faker.random.arrayElement(["B", "C", "BC", "BB", "E"]));
    await driver.findElement(By.id("weight")).sendKeys(faker.datatype.number({ min: 1000, max: 5000 }));
    await driver.findElement(By.id("totalWeight")).sendKeys(faker.datatype.number({ min: 1000, max: 5000 }));
    await driver.findElement(By.id("unitPrice")).sendKeys(faker.commerce.price());
    await driver.findElement(By.id("totalPrice")).sendKeys(faker.commerce.price());
    await driver.findElement(By.id("width")).sendKeys(faker.datatype.number({ min: 1, max: 6 }) * 500);
    await driver.findElement(By.id("length")).sendKeys(faker.datatype.number({ min: 1, max: 6 }) * 500);
    await driver.findElement(By.id("creases")).sendKeys(faker.datatype.number({ min: 1, max: 100 }) <= 75 ? "Não" : Math.floor(100 + Math.random() * 900));
    await driver.findElement(By.id("buyer")).sendKeys(faker.name.findName());
    await driver.findElement(By.id("purchaseDate")).sendKeys(faker.date.past().toLocaleDateString("pt-BR"));
    await driver.findElement(By.id("supplier")).sendKeys(faker.random.arrayElement(["IRANI", "PENHA", "FERNANDEZ"]));
    await driver.findElement(By.id("purchaseID")).sendKeys(Math.floor(100000 + Math.random() * 900000));
    await driver.findElement(By.id("addPlateButton")).click();
    await driver.findElement(By.id("expectedDateManual")).sendKeys(faker.date.future().toLocaleDateString("pt-BR"));
    await driver.findElement(By.id("sendbutton")).click();
  } finally {
    await driver.quit();
  }
}

example();
