package com.example.Lab3.implementation;

import com.example.Lab3.IMDBService;
import com.example.Lab3.exception.MovieRatingNotFoundException;
import com.example.Lab3.model.Movie;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Stream;

@Component
public class IMDBServiceImpl implements IMDBService {

    // Список фильмов
    private final List<Movie> movies = List.of(
            new Movie("tt444", "Дюна", 12),
            new Movie("tt555", "Фильм для 16+", 16)
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
}