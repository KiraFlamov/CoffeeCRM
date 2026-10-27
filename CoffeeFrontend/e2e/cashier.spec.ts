import { expect, test, type Page } from '@playwright/test'
import { CASHIER } from './credentials'

const login = async (page: Page, email: string, password: string) => {
  await page.goto('/')
  await page.getByPlaceholder('Email').fill(email)
  await page.getByPlaceholder('Пароль').fill(password)
  await page.getByRole('button', { name: 'Войти' }).click()
}

test('кассир собирает корзину, оформляет заказ, и он появляется в истории', async ({ page }) => {
  await login(page, CASHIER.email, CASHIER.password)
  await expect(page).toHaveURL('/pos')

  const addToCart = (name: string) =>
    page
      .locator('.product-item')
      .filter({ has: page.getByRole('heading', { name, exact: true }) })
      .getByRole('button', { name: 'Добавить' })
      .click()

  // Цены из seed: капучино 300 ₽, раф 200 ₽
  await addToCart('Большой капучино')
  await addToCart('Большой капучино')
  await addToCart('Сливочный раф')

  const cart = page.locator('.pos-cart')
  await expect(cart).toContainText(/Итого:\s800\s₽/)

  await cart.getByRole('button', { name: 'Оформить заказ' }).click()

  const success = cart.locator('.form-success')
  await expect(success).toHaveText(/Заказ #\d+ оформлен на 800\s₽/)
  await expect(cart.getByText('Корзина пустая')).toBeVisible()

  const orderId = (await success.textContent())?.match(/#(\d+)/)?.[1]
  expect(orderId).toBeDefined()

  await page.getByRole('link', { name: 'Заказы' }).click()
  await expect(page).toHaveURL('/orders')

  const order = page
    .locator('.order-card')
    .filter({ has: page.getByRole('heading', { name: `Заказ #${orderId}`, exact: true }) })

  await expect(order).toContainText(/Большой капучино × 2\s*600\s₽/)
  await expect(order).toContainText(/Сливочный раф × 1\s*200\s₽/)
  await expect(order).toContainText(/Итого:\s800\s₽/)
})

test('кассира с /dashboard перенаправляет на кассу', async ({ page }) => {
  await login(page, CASHIER.email, CASHIER.password)
  await expect(page).toHaveURL('/pos')

  await page.goto('/dashboard')

  await expect(page).toHaveURL('/pos')
  await expect(page.getByRole('heading', { name: 'Касса' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Дашборд' })).toHaveCount(0)
})

test('при неверном пароле показывается ошибка и вход не выполняется', async ({ page }) => {
  await login(page, CASHIER.email, 'wrong-password')

  await expect(page.getByText('Неверный email или пароль')).toBeVisible()
  await expect(page).toHaveURL('/')
})
