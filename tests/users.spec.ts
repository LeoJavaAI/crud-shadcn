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
  await page.getByRole('spinbutton', { name: 'Age' }).fill(testUser.age.toString());
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('textbox', { name: 'Search users...' }).click();
  console.log(testUser.name);
  await page.getByRole('textbox', { name: 'Search users...' }).fill(testUser.name);
  await page.getByRole('row', { name: testUser.name }).getByRole('link', { name: 'Edit' }).click();

  //await page.getByRole('link', { name: 'Edit' }).click();
  await page.getByRole('textbox', { name: 'name *' }).click();
  await page.getByRole('textbox', { name: 'name *' }).fill('new2');
  await page.getByRole('button', { name: 'Update User' }).click();
  await page.getByRole('textbox', { name: 'Search users...' }).click();
  await page.getByRole('textbox', { name: 'Search users...' }).fill('new2');
  //await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('row', { name: 'new2'}).getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('link', { name: '2' }).click();
});
