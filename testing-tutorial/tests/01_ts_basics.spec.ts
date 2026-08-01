import { test, expect } from '@playwright/test';

/**
 * LESSON 1: TypeScript Coding Basics for Testers
 * 
 * TypeScript is JavaScript with static types. Types help catch bugs 
 * BEFORE you run your tests!
 */

test.describe('Lesson 1: TypeScript Basics', () => {

  test('1. Variables, Data Types, and Type Safety', async () => {
    // In TypeScript, we can declare variables with 'const' (cannot change) or 'let' (can change)
    // We can also specify the type using ': type' syntax.

    const testSuiteName: string = 'User Login Automation';
    let passCount: number = 5;
    const isRegression: boolean = true;
    const browsers: string[] = ['Chrome', 'Firefox', 'Safari'];

    // Assertions check if our expectations are met!
    expect(testSuiteName).toBe('User Login Automation');
    expect(passCount).toBe(5);
    expect(isRegression).toBe(true);
    expect(browsers).toContain('Chrome');

    // Trying to assign a string to a number variable like `passCount = "five"` 
    // would cause TypeScript to throw a compile error before the code even runs!
  });

  test('2. Functions & Return Types', async () => {
    /**
     * A function is a reusable block of code.
     * In TypeScript, we define parameter types and return types.
     */
    function calculatePassPercentage(passed: number, total: number): number {
      return (passed / total) * 100;
    }

    const passRate = calculatePassPercentage(8, 10);
    expect(passRate).toBe(80);
  });

  test('3. Interfaces (Defining Object Structures)', async () => {
    /**
     * Interfaces define the "shape" of an object (like a user, product, or API response).
     */
    interface TestCase {
      id: string;
      title: string;
      isAutomated: boolean;
      priority: 'Low' | 'Medium' | 'High'; // Union type (only allows these specific strings)
    }

    const loginTest: TestCase = {
      id: 'TC-101',
      title: 'Verify user login with valid credentials',
      isAutomated: true,
      priority: 'High',
    };

    expect(loginTest.id).toBe('TC-101');
    expect(loginTest.priority).toBe('High');
  });

  test('4. Async / Await (Handling Asynchronous Operations)', async () => {
    /**
     * Web pages and APIs take time to respond over the network.
     * `async` and `await` tell TypeScript: "Wait for this task to complete before moving to the next line."
     */

    // Simulated helper function that pretends to fetch user data from a server after a delay
    async function fetchUserRole(userId: number): Promise<string> {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 50));
      return userId === 1 ? 'Admin' : 'Standard User';
    }

    // We MUST use `await` when calling async functions
    const role = await fetchUserRole(1);
    expect(role).toBe('Admin');
  });

});
