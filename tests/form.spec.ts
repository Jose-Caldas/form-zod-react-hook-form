import { test, expect } from '@playwright/test'

const testURL = 'http://localhost:5173/'
const nameMinErrorMessage = 'O nome deve ter no mínimo 2 caracteres.'
const selectErrorMessage = 'Selecione uma opção de gênero.'
const radioErrorMessage = 'Selecione uma opção de tipo sanguíneo.'
const checkboxErrorMessage = 'Você deve aceitar os termos.'
const dateErrorMessage = 'Selecione uma data depois de hoje.'

test('should prepare the entire form and submit', async ({ page }) => {
  // go to http://localhost:5173/
  await page.goto(testURL)
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

test.describe('Input type text functionality', () => {
  test('should show a message error if input name is empty.', async ({
    page
  }) => {
    await page.goto(testURL)

    // Tenta submeter o formulário sem preencher o campo nome
    await page.click('button[type="submit"]')

    // Verifica se a mensagem de erro é exibida
    const errorMessage = await page.locator('#nameError').textContent()
    expect(errorMessage).toBe(nameMinErrorMessage)
  })

  test('should not show error if the name input has at least 2 characters', async ({
    page
  }) => {
    await page.goto(testURL)

    // Seleciona o campo nome
    const inputName = page.locator('#nome')
    //Preenche o campo com dois caracteres
    await inputName.fill('jo')

    // Tenta submeter o formulário
    await page.click('button[type="submit"]')

    // Verifica se a mensagem de erro não é exibida
    const errorMessage = page.locator('#nameError')
    expect(errorMessage).not.toBeVisible()
  })
})

test.describe('Select element functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testURL)
  })

  test('should select Option 1: Masculino', async ({ page }) => {
    // Seleciona a primeira opção
    const selectedValue = await page.selectOption('select#genero', [
      'Masculino'
    ])
    // Verifica se a primeira opção foi selecionada
    expect(selectedValue).toEqual(['Masculino'])
  })

  test('should select Option 2: Feminino', async ({ page }) => {
    // Seleciona a segunda opção
    const selectedValue = await page.selectOption('select#genero', ['Feminino'])

    // Verifica se a segunda opção foi selecionada
    expect(selectedValue).toEqual(['Feminino'])
  })

  test('should select Option 3: Prefiro não responder', async ({ page }) => {
    // Seleciona a terceira opção
    const selectedValue = await page.selectOption('select#genero', [
      'Prefiro não responder'
    ])
    // Verifica se a terceira opção foi selecionada
    expect(selectedValue).toEqual(['Prefiro não responder'])
  })
  test('should show error message if no select option is selected', async ({
    page
  }) => {
    // Tenta submeter o formulário sem selecionar nenhuma opção
    await page.click('button[type="submit"]')

    // Verifica se a mensagem de erro é exibida
    const errorMessage = await page.locator('#selectError').textContent()
    expect(errorMessage).toBe(selectErrorMessage)
  })
})

test.describe('Radio button functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testURL)
  })

  test('should select Option 1: A+', async ({ page }) => {
    // Seleciona a primeira opção
    await page.check('input[type="radio"][value="A+"]')

    // Verifica se a primeira opção foi selecionada
    const isChecked = await page.isChecked('input[type="radio"][value="A+"]')
    expect(isChecked).toBe(true)
  })

  test('should select Option 2: A-', async ({ page }) => {
    // Seleciona a segunda opção
    await page.check('input[type="radio"][value="A-"]')

    // Verifica se a segunda opção foi selecionada
    const isChecked = await page.isChecked('input[type="radio"][value="A-"]')
    expect(isChecked).toBe(true)
  })

  test('should select Option 3: B+', async ({ page }) => {
    // Seleciona a terceira opção
    await page.check('input[type="radio"][value="B+"]')

    // Verifica se a terceira opção foi selecionada
    const isChecked = await page.isChecked('input[type="radio"][value="B+"]')
    expect(isChecked).toBe(true)
  })
  test('should select Option 4: B-', async ({ page }) => {
    // Seleciona a quarta opção
    await page.check('input[type="radio"][value="B-"]')

    // Verifica se a quarta opção foi selecionada
    const isChecked = await page.isChecked('input[type="radio"][value="B-"]')
    expect(isChecked).toBe(true)
  })
  test('should select Option 5: AB+', async ({ page }) => {
    // Seleciona a quinta opção
    await page.check('input[type="radio"][value="AB+"]')

    // Verifica se a quinta opção foi selecionada
    const isChecked = await page.isChecked('input[type="radio"][value="AB+"]')
    expect(isChecked).toBe(true)
  })
  test('should select Option 6: AB-', async ({ page }) => {
    // Seleciona a sexta opção
    await page.check('input[type="radio"][value="AB-"]')

    // Verifica se a sexta opção foi selecionada
    const isChecked = await page.isChecked('input[type="radio"][value="AB-"]')
    expect(isChecked).toBe(true)
  })
  test('should select Option 7: O+', async ({ page }) => {
    // Seleciona a sétima opção
    await page.check('input[type="radio"][value="O+"]')

    // Verifica se a sétima opção foi selecionada
    const isChecked = await page.isChecked('input[type="radio"][value="O+"]')
    expect(isChecked).toBe(true)
  })
  test('should select Option 8: O-', async ({ page }) => {
    // Seleciona a oitava opção
    await page.check('input[type="radio"][value="O-"]')

    // Verifica se a oitava opção foi selecionada
    const isChecked = await page.isChecked('input[type="radio"][value="O-"]')
    expect(isChecked).toBe(true)
  })

  test('should show error message if no radio button is selected', async ({
    page
  }) => {
    // Tenta submeter o formulário sem selecionar nenhuma opção
    await page.click('button[type="submit"]')

    // Verifica se a mensagem de erro é exibida
    const errorMessage = await page.locator('#radioError').textContent()
    expect(errorMessage).toBe(radioErrorMessage)
  })
})

test.describe('Checkbox validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testURL) // Substitua pela URL da sua página de teste
  })

  test('should show error message if checkbox is not selected', async ({
    page
  }) => {
    // Tenta submeter o formulário sem marcar o checkbox
    await page.click('button[type="submit"]')

    // Verifica se a mensagem de erro é exibida
    const errorMessage = await page.locator('#checkboxError').textContent()
    expect(errorMessage).toBe(checkboxErrorMessage)
  })

  test('should not show error message if checkbox is selected', async ({
    page
  }) => {
    // Marca o checkbox
    await page.check('input[type="checkbox"][id="termo"]')

    // Tenta submeter o formulário
    await page.click('button[type="submit"]')

    // Verifica se a mensagem de erro não é exibida
    const errorMessage = page.locator('#checkboxError')
    expect(errorMessage).not.toBeVisible()
  })
})

test.describe('Date input functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testURL)
  })

  test('should set the date to format YYYY-MM-DD', async ({ page }) => {
    //Seleciona o campo de data
    const dateInput = page.locator('input[type="date"]')

    // Preenche o campo de data
    await dateInput.fill('2024-06-14')

    // Verifica se a data retorna o formato correto
    expect(await dateInput.inputValue()).toBe('2024-06-14')
  })

  test('should show error message if date is today', async ({ page }) => {
    // Obtém a data de hoje no formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0]

    // Preenche o campo de data com a data de hoje
    const dateInput = page.locator('input[type="date"]')
    await dateInput.fill(today)

    // Tenta submeter o formulário
    await page.click('button[type="submit"]')

    // Verifica se a mensagem de erro é exibida
    const errorMessage = await page.locator('#dateError').textContent()
    expect(errorMessage).toBe(dateErrorMessage)
  })

  test('should show error message if date is before today', async ({
    page
  }) => {
    // Obtém a data de ontem no formato YYYY-MM-DD
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toISOString().split('T')[0]

    // Preenche o campo de data com a data de ontem
    const dateInput = page.locator('input[type="date"]')
    await dateInput.fill(yesterdayString)

    // Tenta submeter o formulário
    await page.click('button[type="submit"]')

    // Verifica se a mensagem de erro é exibida
    const errorMessage = await page.locator('#dateError').textContent()
    expect(errorMessage).toBe(dateErrorMessage)
  })

  test('should show error message if no date is selected', async ({ page }) => {
    // Tenta submeter o formulário sem selecionar nenhuma opção
    await page.click('button[type="submit"]')

    // Verifica se a mensagem de erro é exibida
    const errorMessage = await page.locator('#dateError').textContent()
    expect(errorMessage).toBe(dateErrorMessage)
  })
})
