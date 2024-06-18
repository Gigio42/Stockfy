const { Builder, By, until } = require("selenium-webdriver");
const faker = require("faker");

async function example() {
  let driver = await new Builder().forBrowser("firefox").build();
  try {
    await driver.get("https://stockfysite.onrender.com/login/login.html");

    // Login
    await driver.findElement(By.id("username")).sendKeys("seleniumUser");
    await driver.findElement(By.id("password")).sendKeys("selenium");
    await driver.findElement(By.id("login")).click();

    // ir para compras
    await driver.wait(until.elementLocated(By.linkText("Compras")), 10000);
    await driver.findElement(By.linkText("Compras")).click();

    // selecionar fornecedor
    await driver.wait(until.elementLocated(By.id("fornecedor")), 10000);
    await driver.findElement(By.id("fornecedor")).click();
    await driver.findElement(By.css("#fornecedor > option:nth-child(5)")).click();

    // let randomQuantity = Math.floor(Math.random() * 5) + 1;
    let randomQuantity = 5;
    for (let i = 0; i < randomQuantity; i++) {
      let fornecedor = faker.random.arrayElement(["IRANI", "PENHA", "FERNANDEZ"]);
      let qualidade;
      let coluna;

      if (fornecedor === "FERNANDEZ") {
        qualidade = faker.random.arrayElement(["KMK", "FK2"]);
      } else if (fornecedor === "IRANI") {
        qualidade = faker.random.arrayElement(["SLL40", "DKL80"]);
        if (qualidade === "SLL40") {
          coluna = 40;
        } else {
          coluna = 80;
        }
      } else if (fornecedor === "PENHA") {
        qualidade = faker.random.arrayElement(["BR11JJ", "BR11S"]);
      }

      let customerNumberElement = await driver.wait(until.elementIsVisible(driver.findElement(By.id("customerNumber"))), 10000);
      await driver.wait(until.elementIsEnabled(customerNumberElement), 10000);
      await customerNumberElement.clear();
      await customerNumberElement.sendKeys(faker.datatype.number({ min: 1, max: 999 }).toString().padStart(3, "0"));

      let quantityElement = await driver.findElement(By.id("quantity"));
      await quantityElement.clear();
      await quantityElement.sendKeys(faker.datatype.number({ min: 1, max: 4 }) * 500);

      let qualityElement = await driver.findElement(By.id("quality"));
      await qualityElement.clear();
      await qualityElement.sendKeys(qualidade);

      let waveElement = await driver.findElement(By.id("wave"));
      await waveElement.clear();
      await waveElement.sendKeys(faker.random.arrayElement(["B", "C", "BC", "BB", "E"]));

      let weightElement = await driver.findElement(By.id("weight"));
      await weightElement.clear();
      await weightElement.sendKeys(faker.datatype.number({ min: 1000, max: 5000 }));

      let totalWeightElement = await driver.findElement(By.id("totalWeight"));
      await totalWeightElement.clear();
      await totalWeightElement.sendKeys(faker.datatype.number({ min: 1000, max: 5000 }));

      let unitPriceElement = await driver.findElement(By.id("unitPrice"));
      await unitPriceElement.clear();
      await unitPriceElement.sendKeys(faker.commerce.price());

      let totalPriceElement = await driver.findElement(By.id("totalPrice"));
      await totalPriceElement.clear();
      await totalPriceElement.sendKeys(faker.commerce.price());

      let widthElement = await driver.findElement(By.id("width"));
      await widthElement.clear();
      await widthElement.sendKeys(faker.datatype.number({ min: 1, max: 6 }) * 500);

      let lengthElement = await driver.findElement(By.id("length"));
      await lengthElement.clear();
      await lengthElement.sendKeys(faker.datatype.number({ min: 1, max: 6 }) * 500);

      let creasesElement = await driver.findElement(By.id("creases"));
      await creasesElement.clear();
      await creasesElement.sendKeys(faker.datatype.number({ min: 1, max: 100 }) <= 75 ? "Não" : Math.floor(100 + Math.random() * 900));

      let buyerElement = await driver.findElement(By.id("buyer"));
      await buyerElement.clear();
      await buyerElement.sendKeys(faker.name.findName());

      let purchaseDateElement = await driver.findElement(By.id("purchaseDate"));
      await purchaseDateElement.clear();
      await purchaseDateElement.sendKeys(faker.date.past().toISOString().split("T")[0]);

      let supplierElement = await driver.findElement(By.id("supplier"));
      await supplierElement.clear();
      await supplierElement.sendKeys(fornecedor);

      let purchaseIDElement = await driver.findElement(By.id("purchaseID"));
      await purchaseIDElement.clear();
      await purchaseIDElement.sendKeys(Math.floor(100000 + Math.random() * 900000));

      await driver.findElement(By.id("addPlateButton")).click();

      let expectedDateManualElement = await driver.findElement(By.id("expectedDateManual"));
      let futureDate = faker.date.future().toISOString().split("T")[0];
      await driver.executeScript("arguments[0].removeAttribute('readonly')", expectedDateManualElement);
      await expectedDateManualElement.clear();
      await expectedDateManualElement.sendKeys(futureDate);
    }

    await driver.findElement(By.id("sendbutton")).click();
  } finally {
    await driver.quit();
  }
}

example();
