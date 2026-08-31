package com.example.servicerequesttracker.dto;

import com.example.servicerequesttracker.model.Priority;
import com.example.servicerequesttracker.model.TicketStatus;
import java.time.Instant;

public record TicketResponse(
        Long id,
        String title,
        String description,
        Priority priority,
        TicketStatus status,
        Instant createdAt,
        Instant updatedAt) {
}
