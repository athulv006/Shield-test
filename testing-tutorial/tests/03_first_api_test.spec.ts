import { test, expect } from '@playwright/test';

/**
 * LESSON 3: REST API Automation with Playwright & TypeScript
 * 
 * Playwright isn't just for UI! It has a built-in HTTP request client (`request`) 
 * for fast, reliable backend API testing.
 * 
 * We use JSONPlaceholder (a free public mock API) for this demo.
 */

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

test.describe('Lesson 3: API Automation Tests', () => {

  test('GET Request - Verify single post payload & status code', async ({ request }) => {
    // Send a HTTP GET request to fetch post #1
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

    // 1. Assert the HTTP response status code is 200 OK
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // 2. Parse response body as JSON (typed with our Post interface)
    const post: Post = await response.json();

    // 3. Assert specific data fields in the returned JSON object
    expect(post.id).toBe(1);
    expect(post.userId).toBe(1);
    expect(typeof post.title).toBe('string');
    expect(post.title.length).toBeGreaterThan(0);
  });

  test('POST Request - Create a new post resource', async ({ request }) => {
    // Data we want to send in the HTTP POST body
    const newPostData = {
      title: 'Automated API Test with Playwright',
      body: 'Testing backend APIs using TypeScript is fast and clean!',
      userId: 42,
    };

    // Send a HTTP POST request with JSON payload
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: newPostData,
    });

    // 1. Assert HTTP status code is 201 Created
    expect(response.status()).toBe(201);

    // 2. Parse response JSON
    const responseBody = await response.json();

    // 3. Assert the created resource echoes back our data with an assigned ID
    expect(responseBody.title).toBe(newPostData.title);
    expect(responseBody.userId).toBe(newPostData.userId);
    expect(responseBody).toHaveProperty('id');
  });

});
