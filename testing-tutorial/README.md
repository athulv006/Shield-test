# 🚀 TypeScript & Playwright Automation Starter Guide

Welcome to your hands-on TypeScript test automation starter project! This folder is pre-configured with everything you need to start writing and running automated tests.

---

## 📂 Project Structure

```
testing-tutorial/
├── pages/
│   └── TodoPage.ts           # Page Object Model (POM) pattern
├── tests/
│   ├── 01_ts_basics.spec.ts   # Lesson 1: TypeScript syntax & type safety
│   ├── 02_first_ui_test.spec.ts# Lesson 2: Web UI automation (browsers & elements)
│   ├── 03_first_api_test.spec.ts# Lesson 3: REST API automation (GET & POST)
│   └── 04_page_object_model.spec.ts # Lesson 4: Clean architectural test pattern
├── playwright.config.ts      # Playwright runner configuration
└── package.json
```

---

## 🎓 The 4 Lessons Included

1. **[01_ts_basics.spec.ts](file:///Users/athulv/Documents/Hundrd_1100/testing-tutorial/tests/01_ts_basics.spec.ts)**
   - Teaches variables (`const`, `let`), data types (`string`, `number`, `boolean`, `array`), functions, interfaces, and `async/await`.

2. **[02_first_ui_test.spec.ts](file:///Users/athulv/Documents/Hundrd_1100/testing-tutorial/tests/02_first_ui_test.spec.ts)**
   - Teaches browser navigation, finding elements using accessible locators (`getByRole`, `getByPlaceholder`, `getByTestId`), typing text, clicking buttons, and assertions.

3. **[03_first_api_test.spec.ts](file:///Users/athulv/Documents/Hundrd_1100/testing-tutorial/tests/03_first_api_test.spec.ts)**
   - Teaches testing backend HTTP endpoints directly (`GET` and `POST` requests), checking status codes (`200 OK`, `201 Created`), and validating JSON payloads.

4. **[04_page_object_model.spec.ts](file:///Users/athulv/Documents/Hundrd_1100/testing-tutorial/tests/04_page_object_model.spec.ts)**
   - Teaches industrial-standard test architecture: separating element locators and page actions ([TodoPage.ts](file:///Users/athulv/Documents/Hundrd_1100/testing-tutorial/pages/TodoPage.ts)) from your test cases.

---

## 🛠️ How to Run Your Tests

### 1. Run all tests in the terminal
```bash
npx playwright test
```

### 2. Run a specific lesson
```bash
npx playwright test tests/01_ts_basics.spec.ts
npx playwright test tests/02_first_ui_test.spec.ts
npx playwright test tests/03_first_api_test.spec.ts
npx playwright test tests/04_page_object_model.spec.ts
```

### 3. Run tests in headed (visible) browser mode
By default Playwright runs tests in headless mode (invisible browser for maximum speed). To watch the browser open and perform actions:
```bash
npx playwright test --headed
```

### 4. View interactive HTML test report
```bash
npx playwright show-report
```

---

## 🎯 Next Steps for Beginners

1. Open `tests/01_ts_basics.spec.ts` and read through the comments.
2. Try adding a new test in `02_first_ui_test.spec.ts` that adds 3 todo items and checks if deleting one works!
3. Experiment with modifying locators or assertions to see how TypeScript and Playwright report failures when expectations are not met.
