package com.example.Lab3.implementation;

import com.example.Lab3.FilmRatingAgeChecker;
import com.example.Lab3.ViewerService;
import com.example.Lab3.model.Viewer;
import org.springframework.stereotype.Component;

@Component
public class ViewerServiceImpl implements ViewerService {

    private FilmRatingAgeChecker checker;

    public ViewerServiceImpl(FilmRatingAgeChecker checker) {
        this.checker = checker;
    }

    @Override
    public String checkViewerAccess(Viewer viewer) {
        return checker.ageCheck(viewer.getViewerAge(), viewer.getMovieId(), viewer.getHasAccompanying());
    }

}
