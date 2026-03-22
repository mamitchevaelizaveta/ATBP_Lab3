package com.example.Lab3;

import com.example.Lab3.exception.MovieRatingNotFoundException;
import com.example.Lab3.model.Movie;
import org.springframework.stereotype.Component;

public interface IMDBService {

    Movie getMovie(String movieId) throws MovieRatingNotFoundException;

    // геттер, возвращающий movieRating
    Integer getMovieRating(String movieId) throws MovieRatingNotFoundException;

}

