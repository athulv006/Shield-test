import { test, expect } from '@playwright/test';

/**
 * LESSON 2: Web UI Automation with Playwright & TypeScript
 * 
 * Playwright provides auto-waiting, built-in assertions, and easy locators.
 * We will test a simple, real Todo app hosted by Playwright: https://demo.playwright.dev/todomvc/
 */

test.describe('Lesson 2: Todo App UI Automation', () => {

  // Before each test, open the web app
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
  });

  test('Should display page title and heading correctly', async ({ page }) => {
    // 1. Assert the page title in the browser tab
    await expect(page).toHaveTitle(/TodoMVC/);

    // 2. Locate the heading element and assert its text
    const heading = page.getByRole('heading', { name: 'todos' });
    await expect(heading).toBeVisible();
  });

  test('Should allow adding new todo items', async ({ page }) => {
    // Locate the input text box using user-friendly accessibility role/placeholder
    const newTodoInput = page.getByPlaceholder('What needs to be done?');

    // Action 1: Add first item
    await newTodoInput.fill('Learn TypeScript Basics');
    await newTodoInput.press('Enter');

    // Action 2: Add second item
    await newTodoInput.fill('Write first Playwright UI test');
    await newTodoInput.press('Enter');

    // Verification: Locate all item labels in the todo list
    const todoItems = page.getByTestId('todo-title');

    // Assert that exactly 2 items exist in the list
    await expect(todoItems).toHaveCount(2);

    // Assert the exact text of the items
    await expect(todoItems.nth(0)).toHaveText('Learn TypeScript Basics');
    await expect(todoItems.nth(1)).toHaveText('Write first Playwright UI test');
  });

  test('Should allow completing a todo item', async ({ page }) => {
    const newTodoInput = page.getByPlaceholder('What needs to be done?');

    // Add an item
    await newTodoInput.fill('Complete automation tutorial');
    await newTodoInput.press('Enter');

    // Locate the item checkbox and click it
    const todoItem = page.getByTestId('todo-item').first();
    const checkbox = todoItem.getByRole('checkbox');
    await checkbox.check();

    // Verification: Completed items get the CSS class "completed"
    await expect(todoItem).toHaveClass(/completed/);
  });

});
