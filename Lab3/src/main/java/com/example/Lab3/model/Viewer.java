package com.example.Lab3.model;

public class Viewer {

    // поля

    private Integer viewerAge;

    private Boolean hasAccompanying;

    private String movieId;

    // конструктор

    public Viewer() {}

    public Viewer(Integer viewerAge, Boolean hasAccompanying, String movieId) {
        this.viewerAge = viewerAge;
        this.hasAccompanying = hasAccompanying;
        this.movieId = movieId;
    }

    // геттеры

    public Integer getViewerAge() {
        return viewerAge;
    }

    public Boolean getHasAccompanying() {
        return hasAccompanying;
    }

    public String getMovieId() {
        return movieId;
    }

    // сеттеры

    public void setViewerAge(Integer viewerAge) {
        this.viewerAge = viewerAge;
    }

    public void setHasAccompanying(Boolean hasAccompanying) {
        this.hasAccompanying = hasAccompanying;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

}
