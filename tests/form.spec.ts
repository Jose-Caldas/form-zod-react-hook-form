import { test, expect } from '@playwright/test'

test('should prepare the entire form and submit', async ({ page }) => {
  // go to http://localhost:5173/
  await page.goto('http://localhost:5173/')
  // click #nome
  await page.locator('#nome').click()
  // Fill #nome
  await page.locator('#nome').fill('jose')
  // click select
  await page.locator('#genero').selectOption('Masculino')
  // click input[type='radio']
  await page.getByLabel('B-', { exact: true }).check()
  // click input[type='checkbox']
  await page.getByLabel('Aceitar Termos').check()
  // click input[type='date']
  await page.locator('#dataConsulta').fill('2024-06-12')
  // click button[type='submit']
  await page.getByRole('button', { name: 'Submeter' }).click()
})

test.describe('Form functionality', () => {
  test('should show a message error if input name is empty.', async ({
    page
  }) => {
    //vai para a pagina do formulario
    await page.goto('http://localhost:5173/')

    // input name vazio retorna o erro
    await page.locator('#nome').fill('')

    // Clica no botão Submeter
    await page.getByRole('button', { name: 'Submeter' }).click()

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

    // preenche o input name com pelo menos 2 carateres
    await page.locator('#nome').fill('jo')

    // click select e preenche todos os outros campos para não ter erros
    await page.locator('#genero').selectOption('Masculino')
    // click input[type='radio']
    await page.getByLabel('B+', { exact: true }).check()
    // click input[type='checkbox']
    await page.getByLabel('Aceitar Termos').check()
    // click input[type='date']
    await page.locator('#dataConsulta').fill('2024-06-12')
    // click button[type='submit']
    await page.getByRole('button', { name: 'Submeter' }).click()

    // Clica no botão submeter
    await page.getByRole('button', { name: 'Submeter' }).click()

    // input com 2 caracteres não de aparecer o span de erro
    await expect(page.locator('span')).not.toBeVisible()
  })
})
