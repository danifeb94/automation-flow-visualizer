const { chromium } = require('playwright-core');

(async () => {
    console.log('Starting Playwright...');
    const browser = await chromium.launch({
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: true
    });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    page.on('request', req => console.log('>>', req.method(), req.url()));
    page.on('requestfailed', req => console.log('!! Failed', req.url(), req.failure().errorText));

    try {
        console.log('Navigating to http://127.0.0.1:3005...');
        await page.goto('http://127.0.0.1:3005', { timeout: 15000, waitUntil: 'load' });
        console.log('Navigation successful!');
    } catch (err) {
        console.error('Navigation error:', err);
    }

    await browser.close();
})();
