const { test, expect } = require('@playwright/test');
const AgeVerificationPage = require('../pages/AgeVerificationPage.cjs');

test.describe('Проверка возрастного ценза', () => {
  let ageVerificationPage;

  test.beforeEach(async ({ page }) => {
    ageVerificationPage = new AgeVerificationPage(page);
    await ageVerificationPage.navigate();
    await ageVerificationPage.waitForPageLoad();
  });

  test.describe('Позитивные сценарии', () => {
    test('Фильм 12+, зрителю 10 лет + с родителями → доступ разрешён', async () => {
      await ageVerificationPage.fillForm('tt003', 10, true);
      await ageVerificationPage.submitForm();

      const result = await ageVerificationPage.getResult();

      expect(result.allowed).toBe(true);
      expect(result.message).toContain('Доступ разрешён');
    });

    test('Фильм 18+, зрителю 18 лет → доступ разрешён', async () => {
      await ageVerificationPage.fillForm('tt005', 18, false);
      await ageVerificationPage.submitForm();

      const result = await ageVerificationPage.getResult();

      expect(result.allowed).toBe(true);
      expect(result.message).toContain('Доступ разрешён');
    });
  });

  test.describe('Негативные сценарии', () => {
    test('Фильм 18+, зрителю 16 лет → доступ запрещён', async () => {
      await ageVerificationPage.fillForm('tt005', 16, false);
      await ageVerificationPage.submitForm();

      const result = await ageVerificationPage.getResult();

      expect(result.allowed).toBe(false);
      expect(result.message).toContain('Доступ запрещён');
    });

    test('Пустой ID фильма → ошибка', async () => {
      await ageVerificationPage.fillForm('', 15, false);
      await ageVerificationPage.submitForm();

      const error = await ageVerificationPage.getValidationError();
      expect(error).toContain('Введите ID фильма');
    });

    test('Несуществующий ID фильма → ошибка (бэкенд)', async ({ page }) => {
      await ageVerificationPage.fillForm('tt999', 15, false);

      // Перехватываем запрос к API
      let requestCaptured = false;
      await page.route('**/api/cinema/check-access', async route => {
        requestCaptured = true;
        const request = route.request();
        const postData = JSON.parse(request.postData());

        if (postData.movieId === 'tt999') {
          // Мокаем ответ от бэкенда с ошибкой 404
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Movie not found', message: 'Фильм с указанным ID не найден' })
          });
        } else {
          await route.continue();
        }
      });

      await ageVerificationPage.submitForm();

      // Ждем либо карточку результата, либо сообщение об ошибке
      const errorElement = await page.locator('.MuiAlert-root, [role="alert"]').first();
      const isErrorVisible = await errorElement.isVisible().catch(() => false);

      if (isErrorVisible) {
        const errorText = await errorElement.textContent();
        expect(errorText).toMatch(/не найден|ошибка/i);
      } else {
        // Если нет явной ошибки, проверяем результат
        const result = await ageVerificationPage.getResult();
        expect(result.allowed).toBe(false);
        expect(result.message).toContain('Доступ запрещён');
      }

      // Убеждаемся, что запрос был перехвачен
      expect(requestCaptured).toBe(true);
    });

    test('Пустой возраст → ошибка', async () => {
      await ageVerificationPage.fillForm('tt001', '', false);
      await ageVerificationPage.submitForm();

      const error = await ageVerificationPage.getValidationError();
      expect(error).toContain('Введите возраст зрителя');
    });

    test('Отрицательный возраст → ошибка', async () => {
      await ageVerificationPage.fillForm('tt001', -5, false);
      await ageVerificationPage.submitForm();

      const error = await ageVerificationPage.getValidationError();
      expect(error).toContain('Возраст должен быть положительным числом');
    });

    test('Нулевой возраст → ошибка', async () => {
      await ageVerificationPage.fillForm('tt001', 0, false);
      await ageVerificationPage.submitForm();

      const error = await ageVerificationPage.getValidationError();
      expect(error).toContain('Возраст должен быть положительным числом');
    });

    test('Возраст больше 100 → ошибка', async () => {
      await ageVerificationPage.fillForm('tt001', 150, false);
      await ageVerificationPage.submitForm();

      const error = await ageVerificationPage.getValidationError();
      expect(error).toContain('Возраст не может превышать 100 лет');
    });
  });
});