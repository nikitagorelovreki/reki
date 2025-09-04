const { chromium } = require('playwright');

describe('Login Flow E2E Test', () => {
  let browser;
  let page;
  
  const BASE_URL = 'http://localhost:3004';
  const AUTH_API_URL = 'http://localhost:3001/api/auth';
  
  beforeAll(async () => {
    browser = await chromium.launch({ 
      headless: process.env.CI === 'true',
      slowMo: 100 
    });
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  beforeEach(async () => {
    page = await browser.newPage();
    
    // Clear localStorage
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
    });
  });
  
  afterEach(async () => {
    await page.close();
  });
  
  test('should display login form when not authenticated', async () => {
    await page.goto(BASE_URL);
    
    // Should show login form
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Should show test credentials info
    await expect(page.locator('text=admin / password')).toBeVisible();
  });
  
  test('should show error for invalid credentials', async () => {
    await page.goto(BASE_URL);
    
    await page.fill('[data-testid="username-input"]', 'wronguser');
    await page.fill('[data-testid="password-input"]', 'wrongpass');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('.ant-message-error')).toBeVisible();
  });
  
  test('should successfully login with admin credentials', async () => {
    await page.goto(BASE_URL);
    
    // Fill login form
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'password');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation/success
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Should be redirected to dashboard
    expect(page.url()).toContain('/dashboard');
    
    // Should show main layout with user dropdown
    await expect(page.locator('[data-testid="user-dropdown"]')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
  
  test('should successfully login with user credentials', async () => {
    await page.goto(BASE_URL);
    
    await page.fill('[data-testid="username-input"]', 'user');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    expect(page.url()).toContain('/dashboard');
    await expect(page.locator('[data-testid="user-dropdown"]')).toBeVisible();
  });
  
  test('should persist authentication after page reload', async () => {
    // Login first
    await page.goto(BASE_URL);
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Reload page
    await page.reload();
    
    // Should still be logged in
    expect(page.url()).toContain('/dashboard');
    await expect(page.locator('[data-testid="user-dropdown"]')).toBeVisible();
  });
  
  test('should logout successfully', async () => {
    // Login first
    await page.goto(BASE_URL);
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Open user dropdown
    await page.click('[data-testid="user-dropdown"]');
    
    // Click logout
    await page.click('[data-testid="logout-button"]');
    
    // Should be redirected to login form
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
  });
  
  test('should handle API errors gracefully', async () => {
    // Intercept login API and return error
    await page.route(`${AUTH_API_URL}/login`, route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server error' })
      });
    });
    
    await page.goto(BASE_URL);
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('.ant-message-error')).toBeVisible();
  });
  
  test('should validate form fields', async () => {
    await page.goto(BASE_URL);
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('.ant-form-item-explain-error')).toHaveCount(2);
  });
  
  test('should display loading state during login', async () => {
    // Delay the API response
    await page.route(`${AUTH_API_URL}/login`, async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });
    
    await page.goto(BASE_URL);
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('button[type="submit"]');
    
    // Should show loading state
    await expect(page.locator('button[type="submit"]:has-text("Вход...")')).toBeVisible();
  });
});
