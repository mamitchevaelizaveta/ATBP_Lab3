// e2e/pages/AgeVerificationPage.cjs
class AgeVerificationPage {
  constructor(page) {
    this.page = page;
    this.baseUrl = 'http://localhost:5173';

    // Используем id элементов
    this.movieIdInput = '#movieId';
    this.ageInput = '#age';
    this.withAdultCheckbox = '#withAdult';
    this.submitButton = 'button[type="submit"]';
    this.clearButton = 'button:has-text("Очистить")';
    this.resultCard = '.MuiCard-root';
    this.resultMessage = '.MuiTypography-h6';
    this.resultReason = '.MuiAlert-message';
    this.validationError = '.MuiAlert-standardError';
  }

  async navigate() {
    console.log('Навигация на', this.baseUrl);
    await this.page.goto(this.baseUrl, {
      timeout: 15000,
      waitUntil: 'networkidle'
    });
  }

  async waitForPageLoad() {
    await this.page.waitForSelector('#movieId', { timeout: 15000 });
    await this.page.waitForSelector('#age', { timeout: 5000 });
    await this.page.waitForSelector('#withAdult', { timeout: 5000 });
    await this.page.waitForSelector(this.submitButton, { timeout: 5000 });
  }

  async setMovieId(movieId) {
    console.log(`Ввод ID фильма: ${movieId}`);
    await this.page.fill('#movieId', movieId);
  }

  async setAge(age) {
    console.log(`Ввод возраста: ${age}`);
    // Для ввода букв используем type вместо fill
    if (typeof age === 'string' && isNaN(Number(age))) {
      // Если это буквы, используем type
      await this.page.click('#age');
      await this.page.keyboard.type(age);
    } else {
      await this.page.fill('#age', String(age));
    }
  }

  async setWithAdult(withAdult) {
    console.log(`Установка сопровождения: ${withAdult}`);
    if (withAdult) {
      await this.page.check('#withAdult');
    } else {
      await this.page.uncheck('#withAdult');
    }
  }

  async fillForm(movieId, age, withAdult) {
    await this.setMovieId(movieId);
    await this.setAge(age);
    await this.setWithAdult(withAdult);
  }

  async submitForm() {
    console.log('Отправка формы...');
    await this.page.click(this.submitButton);

    try {
      await this.page.waitForResponse(
        response => response.url().includes('/api/cinema/check-access'),
        { timeout: 10000 }
      );
    } catch (error) {
      console.log('Не дождались ответа от API:', error.message);
    }
  }

  async getResult() {
    await this.page.waitForSelector(this.resultCard, { timeout: 10000 });
    const resultMessage = await this.page.locator(this.resultMessage).first().textContent();
    const resultReason = await this.page.locator(this.resultReason).first().textContent();
    const isAllowed = resultMessage.includes('разрешён');

    return {
      allowed: isAllowed,
      message: resultMessage,
      reason: resultReason
    };
  }

  async getValidationError() {
    try {
      await this.page.waitForSelector(this.validationError, { timeout: 3000 });
      return await this.page.locator(this.validationError).textContent();
    } catch (error) {
      return null;
    }
  }

  async clearForm() {
    await this.page.click(this.clearButton);
  }
}

module.exports = AgeVerificationPage;