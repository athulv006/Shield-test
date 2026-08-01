import { Page, Locator, expect } from '@playwright/test';

/**
 * PAGE OBJECT MODEL (POM) PATTERN
 * 
 * Why use Page Objects?
 * 1. Maintainability: If the UI changes (e.g. placeholder text changes), 
 *    you only update this class in ONE place instead of 50 test files.
 * 2. Readability: Tests read like plain English (e.g. `await todoPage.addTodo('Buy milk')`).
 */
export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    // Define element locators once in the constructor
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-title');
    this.heading = page.getByRole('heading', { name: 'todos' });
  }

  // Reusable Page Action: Navigate to the app
  async navigate() {
    await this.page.goto('https://demo.playwright.dev/todomvc/');
  }

  // Reusable Page Action: Add a single todo item
  async addTodo(text: string) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  // Reusable Page Verification: Assert item count and title
  async expectTodoCount(expectedCount: number) {
    await expect(this.todoItems).toHaveCount(expectedCount);
  }
}
