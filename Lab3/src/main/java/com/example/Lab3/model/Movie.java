package com.example.Lab3.model;

public class Movie {

    // поля
    private String movieId;

    private String movieName;

    private Integer movieRating;

    // конструкторы

    public Movie() {}

    public Movie(String movieId, String movieName, Integer movieRating) {
        this.movieId = movieId;
        this.movieName = movieName;
        this.movieRating = movieRating;
    }

    // геттеры, сеттеры
    public String getMovieId() {
        return movieId;
    }

    public String getMovieName() {
        return movieName;
    }

    public Integer getMovieRating() {
        return movieRating;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public void setMovieRating(Integer movieRating) {
        this.movieRating = movieRating;
    }

}
