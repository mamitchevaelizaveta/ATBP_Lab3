package com.example.Lab3.mapping;

import com.example.Lab3.model.Movie;
import com.example.Lab3.model.Viewer;

import com.example.controller.api.MovieDto;
import com.example.controller.api.ViewerDto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR
)
public interface DtoMapper {

    // маппинг фильмов
    @Mapping(target = "movieId", source = "movieId")
    @Mapping(target = "movieName", source = "movieName")
    @Mapping(target = "movieRating", source = "movieRating")
    Movie fromMovieDto(MovieDto movieDto);

    @Mapping(target = "movieId", source = "movieId")
    @Mapping(target = "movieName", source = "movieName")
    @Mapping(target = "movieRating", source = "movieRating")
    MovieDto toMovieDto(Movie movie);

    // маппинг посетителей
    @Mapping(target = "viewerAge", source = "viewerAge")
    @Mapping(target = "hasAccompanying", source = "hasAccompanying")
    @Mapping(target = "movieId", source = "movieId")
    Viewer fromViewerDto(ViewerDto viewerDto);

    @Mapping(target = "viewerAge", source = "viewerAge")
    @Mapping(target = "hasAccompanying", source = "hasAccompanying")
    @Mapping(target = "movieId", source = "movieId")
    ViewerDto toViewerDto(Viewer viewer);

}
