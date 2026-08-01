import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration File
 * This file tells Playwright how to run your tests (browsers to use, timeouts, reporters, etc.).
 */
export default defineConfig({
  // Directory where tests are located
  testDir: './tests',
  
  // Maximum time one test can run (30 seconds)
  timeout: 30 * 1000,
  
  // Run tests in parallel or sequentially
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: false,

  // Reporter to use. 'html' generates a nice interactive web report!
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    // Collect trace when retrying a failed test. See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',
    
    // Take screenshots on test failure automatically
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
