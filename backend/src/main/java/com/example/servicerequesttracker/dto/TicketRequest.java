package com.example.servicerequesttracker.dto;

import com.example.servicerequesttracker.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketRequest(
        @NotBlank(message = "Title is required") @Size(max = 200, message = "Title must be 200 characters or fewer") String title,

        @NotBlank(message = "Description is required") @Size(max = 4000, message = "Description must be 4000 characters or fewer") String description,

        @NotNull(message = "Priority is required") Priority priority) {
}
