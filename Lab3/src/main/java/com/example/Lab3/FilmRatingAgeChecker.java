package com.example.Lab3;

/*
Вариант №16: Возрастной ценз в кино.
1.  Разработайте функцию, которая принимает возраст зрителя и возрастной рейтинг фильма (0+, 6+, 12+, 16+, 18+).
Функция возвращает «разрешено» или «запрещено».
Также функция должна учитывать наличие сопровождающего взрослого (для рейтингов до 16+ включительно это снимает ограничения).
2.  Учтите обработку ошибок: возраст должен быть в диапазоне от 0 до 100 лет.
Рейтинг фильма должен быть из списка допустимых.
3.  Проверьте пограничные случаи (зрителю ровно 12 лет для рейтинга 12+),
влияние сопровождающего и некорректно введенный возраст.
* */

import com.example.Lab3.exception.MovieRatingNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;

@Component
public class FilmRatingAgeChecker {

    private final IMDBService imdbService;

    private ArrayList<Integer> ratings;

    public FilmRatingAgeChecker(IMDBService imdbService) {
        this.imdbService = imdbService;
    }

    public String ageCheck(Integer viewerAge, String movieId, Boolean isAccompanyingAdultExists) {

        System.out.println("Возраст зрителя: " + viewerAge);
        System.out.println(isAccompanyingAdultExists ? "Сопровождающий есть" : "Сопровождающего нет");

        // 1. Валидация возраста
        if (viewerAge == null || viewerAge < 0 || viewerAge > 100) {
            System.out.println("Некорректный возраст: " + viewerAge);
            return "запрещено";
        }

        Integer movieRating;

        try {
            ratings = new ArrayList<>(Arrays.asList(0,6,12,16,18));
            movieRating = imdbService.getMovieRating(movieId);
            if(!ratings.contains(movieRating)) {
                throw new MovieRatingNotFoundException("404");
            }
            System.out.println("Получен рейтинг от сервиса: " + movieRating);
        } catch (MovieRatingNotFoundException e) {
            // реализация сложного сценария
            System.err.println("Фильм не найден в базе. Код ошибки: " + e.getMessage());
            return "запрещено";
        }

        String response;
        switch (movieRating) {
            case 0:
                System.out.println("Возрастной рейтинг: 0+");
                response = (viewerAge >= 0 || isAccompanyingAdultExists) ? "разрешено" : "запрещено";
                break;
            case 6:
                System.out.println("Возрастной рейтинг: 6+");
                response = (viewerAge >= 6 || isAccompanyingAdultExists) ? "разрешено" : "запрещено";
                break;
            case 12:
                System.out.println("Возрастной рейтинг: 12+");
                response = (viewerAge >= 12 || isAccompanyingAdultExists) ? "разрешено" : "запрещено";
                break;
            case 16:
                System.out.println("Возрастной рейтинг: 16+");
                response = (viewerAge >= 16) ? "разрешено" : "запрещено";
                break;
            case 18:
                System.out.println("Возрастной рейтинг: 18+");
                response = (viewerAge >= 18) ? "разрешено" : "запрещено";
                break;
            default:
                System.out.println("Неизвестный рейтинг от сервиса: " + movieRating);
                response = "запрещено";
        }
        return response;
    }

}