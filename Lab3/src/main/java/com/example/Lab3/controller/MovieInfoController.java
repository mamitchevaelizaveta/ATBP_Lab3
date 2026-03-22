package com.example.Lab3.controller;

import com.example.Lab3.IMDBService;
import com.example.Lab3.exception.MovieRatingNotFoundException;
import com.example.Lab3.implementation.IMDBServiceImpl;
import com.example.Lab3.mapping.DtoMapper;

import com.example.controller.api.MovieDto;
import com.example.controller.api.MovieInfoApi;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MovieInfoController implements MovieInfoApi {

    private IMDBServiceImpl imdbService;

    private final DtoMapper mapper;

    public MovieInfoController(DtoMapper mapper, IMDBServiceImpl imdbService) {
        this.mapper = mapper;
        this.imdbService = imdbService;
    }

    public ResponseEntity<MovieDto> getMovieById(String movieId) throws MovieRatingNotFoundException {
        return ResponseEntity.ok(mapper.toMovieDto(imdbService.getMovie(movieId)));
    }

}
