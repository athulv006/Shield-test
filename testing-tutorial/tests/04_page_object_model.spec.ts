import { test } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

/**
 * LESSON 4: Clean Architecture with Page Object Model
 * 
 * Notice how clean, short, and readable these tests are!
 * All locator logic and UI interactions are encapsulated inside `TodoPage`.
 */

test.describe('Lesson 4: Page Object Model Example', () => {

  test('Should workflow adding multiple todos using POM', async ({ page }) => {
    // 1. Initialize the Page Object
    const todoPage = new TodoPage(page);

    // 2. Perform actions using clean methods
    await todoPage.navigate();
    await todoPage.addTodo('Learn TypeScript');
    await todoPage.addTodo('Master Page Object Model');

    // 3. Perform assertion via page object
    await todoPage.expectTodoCount(2);
  });

});
