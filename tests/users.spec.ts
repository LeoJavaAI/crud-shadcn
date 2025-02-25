import { test, expect } from "@playwright/test"
import { generateTestUser } from "./test-helpers"

const testUser = generateTestUser();

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/assistants');
  await page.getByRole('link', { name: 'Add User' }).click();
  await page.getByRole('textbox', { name: 'name *' }).click();
  await page.getByRole('textbox', { name: 'name *' }).fill(testUser.name);
  await page.getByRole('textbox', { name: 'email' }).click();
  await page.getByRole('textbox', { name: 'email' }).fill(testUser.email);
  await page.getByRole('spinbutton', { name: 'Age' }).click();
  await page.getByRole('spinbutton', { name: 'Age' }).click();
  await page.getByRole('spinbutton', { name: 'Age' }).fill(testUser.age.toString());
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('link', { name: '2' }).click();
  await page.getByRole('textbox', { name: 'Search users...' }).click();
  await page.getByRole('textbox', { name: 'Search users...' }).fill('sta');
  await page.getByRole('cell', { name: 'Starter' }).click();
});

