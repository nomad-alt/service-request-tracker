package com.example.servicerequesttracker.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.servicerequesttracker.dto.TicketRequest;
import com.example.servicerequesttracker.dto.TicketResponse;
import com.example.servicerequesttracker.model.Priority;
import com.example.servicerequesttracker.model.TicketStatus;
import com.example.servicerequesttracker.service.TicketService;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(TicketController.class)
class TicketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TicketService ticketService;

    @Test
    void createTicket_withValidRequest_returns201() throws Exception {
        Instant timestamp = Instant.parse("2026-08-31T10:00:00Z");

        TicketResponse response = new TicketResponse(
                1L,
                "Printer unavailable",
                "The office printer is offline",
                Priority.HIGH,
                TicketStatus.OPEN,
                timestamp,
                timestamp);

        when(ticketService.createTicket(any(TicketRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "title": "Printer unavailable",
                          "description": "The office printer is offline",
                          "priority": "HIGH"
                        }
                        """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/tickets/1"))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Printer unavailable"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.status").value("OPEN"));

        verify(ticketService).createTicket(new TicketRequest(
                "Printer unavailable",
                "The office printer is offline",
                Priority.HIGH));
    }

    @Test
    void createTicket_withInvalidRequest_returns400AndFieldErrors() throws Exception {
        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                                "title": " ",
                                "description": "",
                                "priority": null
                        }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.title").value("Title is required"))
                .andExpect(jsonPath("$.fieldErrors.description").value("Description is required"))
                .andExpect(jsonPath("$.fieldErrors.priority").value("Priority is required"));

        verifyNoInteractions(ticketService);
    }
}
