const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/index.html");
  } catch (error) {
    console.error("Failed to launch Puppeteer browser:", error);
    throw error;
  }
});

afterEach(async () => {
  try {
    await browser.close();
  } catch (error) {
    console.error("Failed to close Puppeteer browser:", error);
  }
});

describe('the row', () => {
  it('should display the items horizontally', async () => {
    const flex = await page.$eval('style', (style) => {
      return style.innerHTML.match(/\.row.*{[\s\S][^}]*display.*:.*flex.*;/g).length;
    });

    expect(flex).toEqual(1);
  });
});
