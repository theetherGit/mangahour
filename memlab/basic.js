
// initial page load
function url() {
  return 'https://mangahour.com/home';
}

// action where we want to detect memory leaks
async function action(page /* Puppeteer page API */) {
  let el;
  el = await page.waitForSelector('pierce/div.pt-0 > div > div > section > div > div:nth-of-type(1) h3');
  await el.evaluate(b => b.click());
  el = await page.waitForSelector('pierce/#Kitchen\ Soldier > div:nth-of-type(2) a:nth-of-type(1)');
  await el.evaluate(b => b.click());
}

// go back to the initial state
async function back(page /* Puppeteer page API */) {
  const el = await page.waitForSelector('pierce/header div.flex > a > span');
  await el.evaluate(b => b.click());
}

module.exports = {action, back, url};