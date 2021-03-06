import faker from "faker";
import puppeteer from "puppeteer";
import "regenerator-runtime/runtime";
import { isDebugging } from "./testingInit.js";

// yarn test - для запуска тестирования в браузере без интерфейса
// yarn vizualtest - для запуска тестирования в визуальном режиме
// https://kodaktor.ru/puppet100321 - можно добавить доп штуки

const APP = "https://kodaktor.ru/g/puppetform";

const lead = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  message: faker.random.words(),
};

let page;
let browser;
const width = 1920;
const height = 1080;

beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging().puppeteer);
  [page] = await browser.pages();
  await page.goto(APP);
  await page.setViewport({ width, height });
});

afterAll(() => {
  browser.close();
});

describe("Contact form", () => {
  test(
    "lead can submit a contact request",
    async () => {
      await page.waitForSelector("[data-test=contact-form]");
      await page.click("input[name=name]");
      await page.type("input[name=name]", lead.name);
      await page.click("input[name=email]");
      await page.type("input[name=email]", lead.email);
      await page.click("input[name=tel]");
      await page.type("input[name=tel]", lead.phone);
      await page.click("textarea[name=message]");
      await page.type("textarea[name=message]", lead.message);
      await page.click("input[type=checkbox]");
      await page.click("button[type=submit]");
      await page.waitForSelector(".modal");
    },
    isDebugging().jasmine
  );
});

describe("Testing the frontend", () => {
  test("assert that <title> is correct", async () => {
    const title = await page.title();
    expect(title).toBe("Для тестирования формы с Puppetter");
  });
  // Сюда можно добавить ещё тестов
});

test("assert that a div named navbar exists", async () => {
  const media = await page.$eval(".media", (el) => (el ? true : false));
  expect(media).toBe(true);
});

test("assert that main title contains the correct text", async () => {
  const mainTitleText = await page.$eval(
    ".is-size-5-mobile",
    (el) => el.textContent
  );
  expect(mainTitleText).toEqual("Автор");
});
