package com.example.Lab3.controller;

import com.example.Lab3.FilmRatingAgeChecker;
import com.example.Lab3.implementation.ViewerServiceImpl;
import com.example.Lab3.mapping.DtoMapper;
import com.example.Lab3.model.Viewer;
import com.example.controller.api.CinemaInfoApi;
import com.example.controller.api.ViewerDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CinemaInfoController implements CinemaInfoApi {

    private final DtoMapper mapper;

    private ViewerServiceImpl checker;

    public CinemaInfoController(DtoMapper mapper, ViewerServiceImpl checker) {
        this.mapper = mapper;
        this.checker = checker;
    }

    @PostMapping("/api/cinema/check-access")
    public ResponseEntity<String> checkAccess(ViewerDto viewerDto){
        Viewer viewer = mapper.fromViewerDto(viewerDto);
        return ResponseEntity.ok(checker.checkViewerAccess(viewer));
    }

}
