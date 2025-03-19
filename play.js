const { chromium } = require('playwright');
const fs = require('fs');

const AUTH_FILE = 'auth.json';  // Session storage
const PRODUCTS_FILE = 'C:\\Users\\yasha\\Downloads\\products.json';  // JSON data file
const BASE_URL = 'https://example.com';  // ✅ Replace with your real website
const LOGIN_URL = `${BASE_URL}/auth/login`;  // ✅ Adjust if needed
const CREDENTIALS = {
    username: 'your-username',  // Replace with actual username
    password: 'your-password'   // Replace with actual password
};

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Load products from JSON file
        const productsData = fs.readFileSync(PRODUCTS_FILE);
        const products = JSON.parse(productsData);



        if (fs.existsSync(AUTH_FILE)) {
            console.log("🔑 Using saved session...");
            console.log("Navigating to:", LOGIN_URL);
            await context.storageState({ path: AUTH_FILE });
        } else {
            console.log("🔑 No session found, logging in...");
            await page.goto(LOGIN_URL, { waitUntil: 'load' });

            // Fill in the login form
            await page.fill('input[name="username"]', CREDENTIALS.username);
            await page.fill('input[name="password"]', CREDENTIALS.password);
            await page.click('button[type="submit"]');

            await page.waitForNavigation();  // Wait for login success
            console.log("✅ Logged in successfully!");

            // Save session
            await context.storageState({ path: AUTH_FILE });
        }

        // Navigate to the product display page
        console.log("🚀 Navigating to Product Display...");
        await page.goto(`${BASE_URL}/products`, { waitUntil: 'load' });

        // Iterate through products and display their details
        for (const product of products) {
            console.log(`📦 Product ID: ${product.ID}`);
            console.log(`   Name: ${product.Name}`);
            console.log(`   Description: ${product.Description}`);
            console.log(`   Price: ${product.Price}`);
            console.log(`   Material: ${product.Material}`);
            console.log(`   Dimensions: ${product.Dimensions}`);
            console.log(`   Mass: ${product['Mass (kg)']} kg`);
            console.log(`   Updated: ${product.Updated}`);
            console.log(`   Category: ${product.Category}`);
            console.log('-----------------------------------');

            // Here you can add code to interact with the web page
            // For example, you might want to search for the product or add it to a cart
            // await page.fill('input[name="search"]', product.Name);
            // await page.click('button[type="submit"]');
            // await page.waitForTimeout(2000); // Wait for search results
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await browser.close();
    }
})();