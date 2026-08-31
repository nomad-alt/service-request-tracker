package com.example.servicerequesttracker.controller;

import com.example.servicerequesttracker.dto.TicketRequest;
import com.example.servicerequesttracker.dto.TicketResponse;
import com.example.servicerequesttracker.model.Priority;
import com.example.servicerequesttracker.model.TicketStatus;
import com.example.servicerequesttracker.service.TicketService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody TicketRequest request) {
        TicketResponse response = ticketService.createTicket(request);
        URI location = URI.create("/api/tickets/" + response.id());

        return ResponseEntity.created(location).body(response);
    }

    @GetMapping("/{id}")
    public TicketResponse getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @GetMapping
    public List<TicketResponse> getTickets(
            @RequestParam(name = "status", required = false) TicketStatus status,
            @RequestParam(name = "priority", required = false) Priority priority) {

        if (status != null && priority != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Use either status or priority, not both");
        }

        if (status != null) {
            return ticketService.getTicketsByStatus(status);
        }

        if (priority != null) {
            return ticketService.getTicketsByPriority(priority);
        }

        return ticketService.getAllTickets();
    }
}
