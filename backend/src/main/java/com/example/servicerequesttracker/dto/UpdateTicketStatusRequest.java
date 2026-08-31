package com.example.servicerequesttracker.dto;

import com.example.servicerequesttracker.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTicketStatusRequest(
        @NotNull(message = "Status is required") TicketStatus status) {
}
