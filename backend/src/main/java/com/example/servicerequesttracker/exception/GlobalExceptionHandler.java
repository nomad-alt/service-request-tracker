package com.example.servicerequesttracker.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TicketNotFoundException.class)
    public ResponseEntity<ApiError> handleTicketNotFound(
            TicketNotFoundException exception,
            HttpServletRequest request) {

        return buildError(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request,
                Map.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {

        Map<String, String> fieldErrors = new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(fieldError -> fieldErrors.putIfAbsent(
                        fieldError.getField(),
                        fieldError.getDefaultMessage()));

        return buildError(
                HttpStatus.BAD_REQUEST,
                "Validation failed",
                request,
                fieldErrors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleHttpMessageNotReadable(
            HttpMessageNotReadableException exception,
            HttpServletRequest request) {

        return buildError(
                HttpStatus.BAD_REQUEST,
                "Malformed JSON request or invalid value",
                request,
                Map.of());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException exception,
            HttpServletRequest request) {

        return buildError(
                HttpStatus.BAD_REQUEST,
                "Invalid value for parameter: " + exception.getName(),
                request,
                Map.of());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleResponseStatusException(
            ResponseStatusException exception,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());
        String message = exception.getReason() != null
                ? exception.getReason()
                : "Request failed";

        return buildError(status, message, request, Map.of());
    }

    private ResponseEntity<ApiError> buildError(
            HttpStatus status,
            String message,
            HttpServletRequest request,
            Map<String, String> fieldErrors) {

        ApiError error = new ApiError(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                fieldErrors);

        return ResponseEntity.status(status).body(error);
    }
}
