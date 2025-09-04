// Simple login test without @playwright/test dependency
const { chromium } = require('playwright');

async function runLoginTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Starting login test...');
    
    // Navigate to Control Panel
    console.log('📍 Navigating to http://localhost:3004');
    await page.goto('http://localhost:3004');
    await page.waitForTimeout(2000);
    
    // Check if login form is visible
    console.log('🔍 Looking for login form...');
    const loginForm = await page.locator('form').first();
    if (!await loginForm.isVisible()) {
      throw new Error('Login form not found');
    }
    console.log('✅ Login form found');
    
    // Fill login credentials
    console.log('📝 Filling admin credentials...');
    await page.fill('[data-testid="username-input"]', 'admin');
    await page.fill('[data-testid="password-input"]', 'password');
    console.log('✅ Credentials filled');
    
    // Submit form
    console.log('🚀 Submitting login form...');
    await page.click('button[type="submit"]');
    
    // Wait for response and check result
    await page.waitForTimeout(3000);
    
    // Check if we're redirected to dashboard or if there's an error
    const currentUrl = page.url();
    console.log('📍 Current URL after login:', currentUrl);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Login successful - redirected to dashboard');
      
      // Check for user dropdown
      const userDropdown = await page.locator('[data-testid="user-dropdown"]');
      if (await userDropdown.isVisible()) {
        console.log('✅ User dropdown visible - authentication working');
      } else {
        console.log('⚠️  User dropdown not found, but URL suggests success');
      }
    } else {
      // Check for error messages
      const errorMessage = await page.locator('.ant-message-error');
      if (await errorMessage.isVisible()) {
        const errorText = await errorMessage.textContent();
        console.log('❌ Login failed with error:', errorText);
      } else {
        console.log('❌ Login failed - no redirect to dashboard');
      }
    }
    
    // Test logout if we're logged in
    if (currentUrl.includes('/dashboard')) {
      console.log('🔍 Testing logout...');
      try {
        await page.click('[data-testid="user-dropdown"]');
        await page.waitForTimeout(1000);
        await page.click('[data-testid="logout-button"]');
        await page.waitForTimeout(2000);
        
        const afterLogoutUrl = page.url();
        if (!afterLogoutUrl.includes('/dashboard')) {
          console.log('✅ Logout successful');
        } else {
          console.log('❌ Logout failed');
        }
      } catch (e) {
        console.log('⚠️  Logout test failed:', e.message);
      }
    }
    
    console.log('🎉 Test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Take screenshot on failure
    try {
      await page.screenshot({ path: 'test-failure.png' });
      console.log('📸 Screenshot saved as test-failure.png');
    } catch (e) {
      console.log('Failed to save screenshot:', e.message);
    }
  }
  
  await browser.close();
}

// Run the test
if (require.main === module) {
  runLoginTest().catch(console.error);
}
