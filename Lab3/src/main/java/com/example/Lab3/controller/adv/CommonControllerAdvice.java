package com.example.Lab3.controller.adv;

import com.example.Lab3.exception.MovieRatingNotFoundException;
import com.example.controller.api.ErrorDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CommonControllerAdvice {

    @ExceptionHandler(MovieRatingNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND) // 404
    public ErrorDto handleUnexpected(MovieRatingNotFoundException exception) {
        ErrorDto errorDto = new ErrorDto();
        errorDto.setCode("404");
        errorDto.setMessage(exception.getMessage());
        return errorDto;
    }

}
