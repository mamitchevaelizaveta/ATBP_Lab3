package com.example.Lab3.implementation;

import com.example.Lab3.IMDBService;
import com.example.Lab3.exception.MovieRatingNotFoundException;
import com.example.Lab3.model.Movie;
import org.springframework.stereotype.Component;

import java.util.stream.Stream;

@Component
public class IMDBServiceImpl implements IMDBService {

    // фейковая реализация

    @Override
    public Movie getMovie(String movieId) throws MovieRatingNotFoundException {
        return Stream.of("tt444")
                .filter(id -> id.equals(movieId))
                .findFirst()
                .map(id -> new Movie("tt444", "Дюна", 12))
                .orElseThrow(() -> new MovieRatingNotFoundException("Фильм с id " + movieId + " не найден"));
    }

    @Override
    public Integer getMovieRating(String movieId) throws MovieRatingNotFoundException {
        return Stream.of("tt444")
                .filter(id -> id.equals(movieId))
                .findFirst()
                .map(id -> 12)
                .orElseThrow(() -> new MovieRatingNotFoundException("Фильм с id " + movieId + " не найден"));
    }

}
