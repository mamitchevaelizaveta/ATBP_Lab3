package com.example.Lab3.exception;

import java.io.IOException;

public class MovieRatingNotFoundException extends RuntimeException {
    public MovieRatingNotFoundException(String message) {
        super(message);
    }
}
