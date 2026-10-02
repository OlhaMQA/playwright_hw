import { test, expect } from '@playwright/test';

test('menu tabs change color to goldenrod when active', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await expect(page.getByRole('link', { name: 'Menu page' })).toHaveCSS('color', 'rgb(218, 165, 32)');
  await expect(page.getByRole('link', { name: 'Cart page' })).toHaveCSS('color', 'rgb(0, 0, 0)');
  await expect(page.getByRole('link', { name: 'GitHub page' })).toHaveCSS('color', 'rgb(0, 0, 0)');
  await page.getByRole('link', { name: 'Cart page' }).click();
  await expect(page.getByRole('link', { name: 'Menu page' })).toHaveCSS('color', 'rgb(0, 0, 0)');
  await expect(page.getByRole('link', { name: 'Cart page' })).toHaveCSS('color', 'rgb(218, 165, 32)');
  await expect(page.getByRole('link', { name: 'GitHub page' })).toHaveCSS('color', 'rgb(0, 0, 0)');
  await page.getByRole('link', { name: 'GitHub page' }).click();
  await expect(page.getByRole('link', { name: 'Menu page' })).toHaveCSS('color', 'rgb(0, 0, 0)');
  await expect(page.getByRole('link', { name: 'Cart page' })).toHaveCSS('color', 'rgb(0, 0, 0)');
  await expect(page.getByRole('link', { name: 'GitHub page' })).toHaveCSS('color', 'rgb(218, 165, 32)');
});

test('empty cart text', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.getByRole('link', { name: 'Cart page' }).click();
  await expect(page.getByRole('paragraph')).toContainText('No coffee, go add some.');
});

test('adding product to cart changes cart tab text', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await expect(page.getByRole('link', { name: 'Cart page' })).toContainText('cart (0)');
  await page.locator('[data-test="Espresso"]').click();
  await expect(page.getByRole('link', { name: 'Cart page' })).toContainText('cart (1)');
});

test('adding product to cart changes total', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $10.00');
});

test('hovering over total shows cart preview', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso"]').click();
  await page.locator('[data-test="checkout"]').hover();
  await expect(page.locator('ul.cart-preview li div').nth(0).locator('span'))
  .toHaveText(['Espresso', 'x 1']);
});

test('successful payment message', async ({ page }) => {
  await page.goto('https://coffee-cart.app/');
  await page.locator('[data-test="Espresso"]').click();
  await page.getByRole('link', { name: 'Cart page' }).click();
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Ola');
  await page.getByRole('textbox', { name: 'Email' }).fill('ola@ola.com');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('.snackbar.success')).toBeVisible();
  await expect(page.locator('.snackbar.success')).toContainText('Thanks for your purchase. Please check your email for payment.');
});


