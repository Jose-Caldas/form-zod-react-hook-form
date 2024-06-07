import { test, expect } from '@playwright/test'

test.describe('Form functionality', () => {
  test('should show a message error if input name is empty.', async ({
    page
  }) => {
    //vai para a pagina do formulario
    await page.goto('http://localhost:5173/')

    // preenche o input name
    await page.fill('input[type="text"]', '')

    // Clica no botão submit
    await page.click('button[type="submit"]')

    // input vazio deve mostrar a mensagem de erro

    await expect(page.locator('#error-message')).toHaveText(
      'O nome deve ter no mínimo 2 caracteres.'
    )
  })

  test('should not show error if the name input has at least 2 characters', async ({
    page
  }) => {
    //vai para a pagina do formulario
    await page.goto('http://localhost:5173/')

    // preenche o input name
    await page.fill('input[type="text"]', 'Jo')

    // Clica no botão submit
    await page.click('button[type="submit"]')

    // input com 2 caracteres não de aparecer o span
    await expect(page.locator('span')).not.toBeVisible()
  })

  //   test('should show error message with invalid credentials', async ({
  //     page
  //   }) => {
  //     // Navega para a página de login
  //     await page.goto('https://example.com/login')

  //     // Preenche o campo de email
  //     await page.fill('input[name="email"]', 'user@example.com')

  //     // Preenche o campo de senha errado
  //     await page.fill('input[name="password"]', 'wrongpassword')

  //     // Clica no botão de login
  //     await page.click('button[type="submit"]')

  //     // Verifica se a mensagem de erro é exibida
  //     await expect(page.locator('.error-message')).toHaveText(
  //       'Invalid email or password.'
  //     )
  //   })
})
