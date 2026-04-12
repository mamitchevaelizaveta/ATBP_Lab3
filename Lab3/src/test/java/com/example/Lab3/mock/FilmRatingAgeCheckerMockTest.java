package com.example.Lab3.mock;

import com.example.Lab3.FilmRatingAgeChecker;
import com.example.Lab3.exception.MovieRatingNotFoundException;
import com.example.Lab3.implementation.IMDBServiceImpl;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SpringBootTest
@SpringJUnitConfig
public class FilmRatingAgeCheckerMockTest {

    /*
    Вариант №16: Возрастной ценз в кино (с Movies Database).
    1.	Расширение: Рейтинг фильма теперь не передается в функцию, а запрашивается по movieId из IMDbService.getMovieRating(id).
    2.	Зависимость (Mock): Мокируйте API кинобазы.
    3.	Сложный сценарий: Проверьте случай, когда фильм не найден в базе (ошибка 404), и функция должна по умолчанию запретить просмотр.
    */

    @MockitoBean
    private IMDBServiceImpl imdbService; // Мокаем конкретную реализацию, а не интерфейс

    @Autowired
    private FilmRatingAgeChecker checker;

    @Test
    @DisplayName("Успешный запрос: фильм с рейтингом 12+, зрителю 13 лет — разрешено")
    void testAllowedWhenAgeEqualsRating() throws MovieRatingNotFoundException {
        when(imdbService.getMovieRating("tt123")).thenReturn(12);

        String result = checker.ageCheck(13, "tt123", false);

        assertEquals("разрешено", result);
        verify(imdbService, times(1)).getMovieRating("tt123");
    }

    @Test
    @DisplayName("Успешный запрос: фильм 18+, зрителю 25 лет — разрешено")
    void testAllowedAdultViewer() throws MovieRatingNotFoundException {
        when(imdbService.getMovieRating("tt456")).thenReturn(18);

        String result = checker.ageCheck(25, "tt456", false);

        assertEquals("разрешено", result);
        verify(imdbService).getMovieRating("tt456");
    }

    @Test
    @DisplayName("Фильм 6+, зрителю 5 лет с сопровождающим — разрешено")
    void testAllowedWithAccompanyingFor6Plus() throws MovieRatingNotFoundException {
        when(imdbService.getMovieRating("tt789")).thenReturn(6);

        String result = checker.ageCheck(5, "tt789", true);

        assertEquals("разрешено", result);
        verify(imdbService).getMovieRating("tt789");
    }

    // негативные сценарии
    @Test
    @DisplayName("Фильм 16+, зрителю 14 лет без сопровождающего — запрещено")
    void testDeniedUnderageWithoutAccompanyingFor16Plus() throws MovieRatingNotFoundException {
        when(imdbService.getMovieRating("tt999")).thenReturn(16);

        String result = checker.ageCheck(14, "tt999", false);

        assertEquals("запрещено", result);
        verify(imdbService).getMovieRating("tt999");
    }

    @Test
    @DisplayName("Фильм 16+, зрителю 14 лет с сопровождающим запрещено")
    void testDeniedUnderageEvenWithAccompanyingFor16Plus() throws MovieRatingNotFoundException {
        when(imdbService.getMovieRating("tt111")).thenReturn(16);

        String result = checker.ageCheck(14, "tt111", true);

        assertEquals("запрещено", result);
        verify(imdbService).getMovieRating("tt111");
    }

    @Test
    @DisplayName("Фильм 18+, зрителю 17 лет с сопровождающим запрещено")
    void testDeniedUnder18EvenWithAccompanying() throws MovieRatingNotFoundException {
        when(imdbService.getMovieRating("tt000")).thenReturn(18);

        String result = checker.ageCheck(17, "tt000", true);

        assertEquals("запрещено", result);
        verify(imdbService).getMovieRating("tt000");
    }

    // сложный сценарий с ошибкой 404
    @Test
    @DisplayName("СЛОЖНЫЙ СЦЕНАРИЙ: фильм не найден — доступ запрещён")
    void testMovieNotFound_ShouldDeny() throws MovieRatingNotFoundException {
        when(imdbService.getMovieRating("tt404"))
                .thenThrow(new MovieRatingNotFoundException("Фильм с id tt404 не найден"));

        String result = checker.ageCheck(30, "tt404", true);

        assertEquals("запрещено", result);
        verify(imdbService).getMovieRating("tt404");
    }

    @Test
    @DisplayName("Сервис вернул некорректный рейтинг — запрещено")
    void testInvalidRatingFromService_ShouldDeny() throws MovieRatingNotFoundException {
        when(imdbService.getMovieRating("tt777")).thenReturn(5);

        String result = checker.ageCheck(20, "tt777", true);

        assertEquals("запрещено", result);
        verify(imdbService).getMovieRating("tt777");
    }

    // граничные значения
    @ParameterizedTest
    @CsvSource({
            "0, tt001, false, разрешено",
            "5, tt002, false, запрещено",
            "6, tt003, false, разрешено",
            "11, tt004, false, запрещено",
            "12, tt005, false, разрешено",
            "15, tt006, false, запрещено",
            "16, tt007, false, разрешено",
            "17, tt008, false, запрещено",
            "18, tt009, false, разрешено",
            "100, tt010, false, разрешено"
    })
    @DisplayName("Граничные значения возраста без сопровождающего")
    void testBoundaryValues(int age, String movieId, boolean accompanying, String expected)
            throws MovieRatingNotFoundException {
        int rating = switch (movieId) {
            case "tt001" -> 0;
            case "tt002", "tt003" -> 6;
            case "tt004", "tt005" -> 12;
            case "tt006", "tt007" -> 16;
            case "tt008", "tt009", "tt010" -> 18;
            default -> 0;
        };

        when(imdbService.getMovieRating(movieId)).thenReturn(rating);

        String result = checker.ageCheck(age, movieId, accompanying);
        assertEquals(expected, result);
    }

    // некорректный ввод
    @ParameterizedTest
    @CsvSource({
            "-1, tt001, false, запрещено",
            "101, tt002, true, запрещено"
    })
    @DisplayName("Некорректный возраст (отрицательный или >100) — запрещено")
    void testInvalidAge(int age, String movieId, boolean accompanying, String expected)
            throws MovieRatingNotFoundException {
        String result = checker.ageCheck(age, movieId, accompanying);
        assertEquals(expected, result);
        verify(imdbService, never()).getMovieRating(anyString());
    }

    @Test
    @DisplayName("Некорректный возраст (null) — запрещено")
    void testNullAge_ShouldDeny() throws MovieRatingNotFoundException {
        String result = checker.ageCheck(null, "tt003", false);

        assertEquals("запрещено", result);
        verify(imdbService, never()).getMovieRating(anyString());
    }
}