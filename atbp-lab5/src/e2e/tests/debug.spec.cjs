// e2e/tests/debug.spec.cjs
const { test, expect } = require('@playwright/test');
const AgeVerificationPage = require('../pages/AgeVerificationPage.cjs');

test.describe('Отладка', () => {
  let page;
  let ageVerificationPage;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    ageVerificationPage = new AgeVerificationPage(page);
    await ageVerificationPage.navigate();
    await ageVerificationPage.waitForPageLoad();
  });

  test('Простой тест: проверить существование элементов', async () => {
    console.log('Проверка существования элементов формы...');

    // Проверяем наличие всех элементов
    const movieIdInput = await page.locator('#movieId').count();
    console.log(`Input ID фильма: ${movieIdInput > 0 ? 'найден' : 'не найден'}`);

    const ageInput = await page.locator('input[type="number"]').count();
    console.log(`Input возраста: ${ageInput > 0 ? 'найден' : 'не найден'}`);

    const checkbox = await page.locator('input[type="checkbox"]').count();
    console.log(`Чекбокс: ${checkbox > 0 ? 'найден' : 'не найден'}`);

    const submitButton = await page.locator('button:has-text("Проверить доступ")').count();
    console.log(`Кнопка отправки: ${submitButton > 0 ? 'найден' : 'не найден'}`);

    // Делаем скриншот
    await page.screenshot({ path: 'screenshots/debug-page.png', fullPage: true });

    expect(movieIdInput).toBeGreaterThan(0);
    expect(ageInput).toBeGreaterThan(0);
    expect(submitButton).toBeGreaterThan(0);
  });

  test('Заполнить форму и отправить', async () => {
    console.log('Заполнение формы...');

    await ageVerificationPage.fillForm('tt001', 5, false);

    // Делаем скриншот после заполнения
    await page.screenshot({ path: 'screenshots/filled-form.png' });

    console.log('Отправка формы...');
    await ageVerificationPage.submitForm();

    // Ждем результата
    await page.waitForTimeout(2000);

    // Делаем скриншот после отправки
    await page.screenshot({ path: 'screenshots/after-submit.png' });

    // Проверяем, появился ли результат
    const resultCard = await page.locator('.MuiCard-root').count();
    console.log(`Карточка результата: ${resultCard > 0 ? 'найдена' : 'не найдена'}`);

    if (resultCard > 0) {
      const resultText = await page.locator('.MuiTypography-h6').textContent();
      console.log(`Текст результата: ${resultText}`);
    }

    expect(resultCard).toBeGreaterThan(0);
  });
});