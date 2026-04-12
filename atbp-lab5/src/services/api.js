// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const mockMovies = {
  'tt001': { movieId: 'tt001', movieName: 'Приключения Буратино', movieRating: 0 },
  'tt002': { movieId: 'tt002', movieName: 'В поисках Немо', movieRating: 6 },
  'tt003': { movieId: 'tt003', movieName: 'Гарри Поттер и философский камень', movieRating: 12 },
  'tt004': { movieId: 'tt004', movieName: 'Бойцовский клуб', movieRating: 16 },
  'tt005': { movieId: 'tt005', movieName: 'Зеленая миля', movieRating: 18 },
  'tt444': { movieId: 'tt444', movieName: 'Начало', movieRating: 16 },
  'tt555': { movieId: 'tt555', movieName: 'Остров проклятых', movieRating: 18 },
};

// Функция для проверки доступа к фильму через API
export const checkMovieAccess = async (movieId, age, withAdult) => {
  try {
    const requestBody = {
      movieId: movieId.trim(),
      viewerAge: age,
      hasAccompanying: withAdult
    };

    console.log('Отправляем запрос на бэкенд:', requestBody);

    const response = await fetch(`${API_BASE_URL}/cinema/check-access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage = `Ошибка сервера: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('Детали ошибки:', errorData);
      } catch (e) {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    const result = await response.text();
    const allowed = result === "разрешено";

    console.log('Ответ от бэкенда:', result);

    let movieTitle = "Неизвестный фильм";
    let ageRating = 0;

    try {
      const movieInfo = await getMovieInfo(movieId);
      movieTitle = movieInfo.movieName;
      ageRating = movieInfo.movieRating;
    } catch (err) {
      console.warn('Не удалось получить информацию о фильме:', err);
      const mockMovie = mockMovies[movieId.trim().toLowerCase()];
      if (mockMovie) {
        movieTitle = mockMovie.movieName;
        ageRating = mockMovie.movieRating;
      }
    }

    return {
      allowed: allowed,
      movieId: movieId,
      movieTitle: movieTitle,
      ageRating: ageRating,
      message: allowed ? 'Доступ разрешён' : 'Доступ запрещён',
      reason: allowed
        ? 'Доступ разрешен на основании проверки возрастного ценза'
        : 'Доступ запрещен. Возраст зрителя не соответствует возрастному рейтингу фильма'
    };

  } catch (error) {
    console.error('Ошибка при запросе к бэкенду:', error);
    return mockCheckMovieAccess(movieId, age, withAdult);
  }
};

export const getMovieInfo = async (movieId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка загрузки фильма: ${response.status}`);
    }

    const data = await response.json();
    console.log('Информация о фильме:', data);

    return {
      movieId: data.movieId,
      movieName: data.movieName,
      movieRating: data.movieRating
    };
  } catch (error) {
    console.warn('Не удалось загрузить информацию о фильме:', error.message);
    const mockMovie = mockMovies[movieId.toLowerCase()];
    if (mockMovie) {
      return mockMovie;
    }
    throw error;
  }
};

export const getAvailableMovies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка загрузки фильмов: ${response.status}`);
    }

    const data = await response.json();
    console.log('Получены фильмы с бэкенда:', data);

    return data.map(movie => ({
      id: movie.movieId,
      title: movie.movieName,
      ageRating: movie.movieRating
    }));
  } catch (error) {
    console.warn('Не удалось загрузить фильмы с бэкенда, используются моковые данные:', error.message);
    return Object.values(mockMovies).map(movie => ({
      id: movie.movieId,
      title: movie.movieName,
      ageRating: movie.movieRating
    }));
  }
};

const mockCheckMovieAccess = async (movieId, age, withAdult) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const normalizedId = movieId.trim().toLowerCase();
  const movie = mockMovies[normalizedId];

  if (!movie) {
    throw new Error('Фильм с указанным ID не найден');
  }

  let allowed = false;
  let reason = '';

  if (movie.movieRating <= 12) {
    if (age >= movie.movieRating) {
      allowed = true;
      reason = `Зрителю ${age} лет, что соответствует возрастному ограничению ${movie.movieRating}+`;
    } else if (withAdult) {
      allowed = true;
      reason = `Хотя зрителю ${age} лет (меньше ${movie.movieRating}+), наличие сопровождения взрослых разрешает просмотр`;
    } else {
      allowed = false;
      reason = `Зрителю ${age} лет (меньше ${movie.movieRating}+). Для просмотра необходимо достичь ${movie.movieRating} лет или находиться в сопровождении взрослых`;
    }
  } else if (movie.movieRating === 16) {
    if (age >= 16) {
      allowed = true;
      reason = `Зрителю ${age} лет, что соответствует возрастному ограничению 16+`;
    } else {
      allowed = false;
      reason = `Для просмотра фильма категории 16+ необходимо быть старше 16 лет. Сопровождение взрослых не допускается`;
    }
  } else if (movie.movieRating === 18) {
    if (age >= 18) {
      allowed = true;
      reason = `Зрителю ${age} лет, что соответствует возрастному ограничению 18+`;
    } else {
      allowed = false;
      reason = `Для просмотра фильма категории 18+ необходимо быть старше 18 лет. Сопровождение взрослых не допускается`;
    }
  }

  return {
    allowed,
    movieId: movie.movieId,
    movieTitle: movie.movieName,
    ageRating: movie.movieRating,
    message: allowed ? 'Доступ разрешён' : 'Доступ запрещён',
    reason: reason
  };
};