package com.example.Lab3.implementation;

import com.example.Lab3.IMDBService;
import com.example.Lab3.exception.MovieRatingNotFoundException;
import com.example.Lab3.model.Movie;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class IMDBServiceImpl implements IMDBService {

    // Список фильмов с реальными названиями и возрастными рейтингами
    private final List<Movie> movies = List.of(
            new Movie("tt001", "Приключения Буратино", 0),
            new Movie("tt002", "В поисках Немо", 6),
            new Movie("tt003", "Гарри Поттер и философский камень", 12),
            new Movie("tt004", "Бойцовский клуб", 16),
            new Movie("tt005", "Зеленая миля", 18),
            new Movie("tt444", "Начало", 16),
            new Movie("tt555", "Остров проклятых", 18)
    );

    @Override
    public Movie getMovie(String movieId) throws MovieRatingNotFoundException {
        return movies.stream()
                .filter(movie -> movie.getMovieId().equals(movieId))
                .findFirst()
                .orElseThrow(() -> new MovieRatingNotFoundException("Фильм с id " + movieId + " не найден"));
    }

    @Override
    public Integer getMovieRating(String movieId) throws MovieRatingNotFoundException {
        return movies.stream()
                .filter(movie -> movie.getMovieId().equals(movieId))
                .map(Movie::getMovieRating)
                .findFirst()
                .orElseThrow(() -> new MovieRatingNotFoundException("Фильм с id " + movieId + " не найден"));
    }

    public List<Movie> getAllMovies() {
        return movies;
    }
}