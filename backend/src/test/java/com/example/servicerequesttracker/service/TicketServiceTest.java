package com.example.servicerequesttracker.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.servicerequesttracker.dto.TicketRequest;
import com.example.servicerequesttracker.dto.TicketResponse;
import com.example.servicerequesttracker.exception.TicketNotFoundException;
import com.example.servicerequesttracker.model.Priority;
import com.example.servicerequesttracker.model.Ticket;
import com.example.servicerequesttracker.model.TicketStatus;
import com.example.servicerequesttracker.repository.TicketRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @InjectMocks
    private TicketService ticketService;

    @Test
    void createTicket_savesAndReturnsOpenTicket() {
        TicketRequest request = new TicketRequest(
                "Printer unavailable",
                "The office printer is offline",
                Priority.HIGH);

        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TicketResponse response = ticketService.createTicket(request);

        assertEquals("Printer unavailable", response.title());
        assertEquals("The office printer is offline", response.description());
        assertEquals(Priority.HIGH, response.priority());
        assertEquals(TicketStatus.OPEN, response.status());
        verify(ticketRepository).save(any(Ticket.class));
    }

    @Test
    void getTicketById_whenMissing_throwsTicketNotFoundException() {
        Long id = 999L;
        when(ticketRepository.findById(id)).thenReturn(Optional.empty());

        TicketNotFoundException exception = assertThrows(
                TicketNotFoundException.class,
                () -> ticketService.getTicketById(id));

        assertEquals("Ticket not found with id: 999", exception.getMessage());
        verify(ticketRepository).findById(id);
    }

    @Test
    void updateTicket_updatesEditableFieldsAndKeepsStatus() {
        Long id = 1L;
        Ticket existingTicket = new Ticket(
                "Old title",
                "Old description",
                Priority.LOW);

        TicketRequest request = new TicketRequest(
                "New title",
                "New description",
                Priority.HIGH);

        when(ticketRepository.findById(id)).thenReturn(Optional.of(existingTicket));
        when(ticketRepository.save(existingTicket)).thenReturn(existingTicket);

        TicketResponse response = ticketService.updateTicket(id, request);

        assertEquals("New title", response.title());
        assertEquals("New description", response.description());
        assertEquals(Priority.HIGH, response.priority());
        assertEquals(TicketStatus.OPEN, response.status());
        verify(ticketRepository).findById(id);
        verify(ticketRepository).save(existingTicket);
    }

    @Test
    void updateStatus_changesStatusWithoutChangingContent() {
        Long id = 1L;
        Ticket existingTicket = new Ticket(
                "Existing title",
                "Existing description",
                Priority.MEDIUM);

        when(ticketRepository.findById(id)).thenReturn(Optional.of(existingTicket));
        when(ticketRepository.save(existingTicket)).thenReturn(existingTicket);

        TicketResponse response = ticketService.updateStatus(id, TicketStatus.CLOSED);

        assertEquals(TicketStatus.CLOSED, response.status());
        assertEquals("Existing title", response.title());
        assertEquals("Existing description", response.description());
        assertEquals(Priority.MEDIUM, response.priority());
        verify(ticketRepository).save(existingTicket);
    }

    @Test
    void deleteTicket_deletesExistingTicket() {
        Long id = 1L;
        Ticket existingTicket = new Ticket(
                "Existing title",
                "Existing description",
                Priority.MEDIUM);

        when(ticketRepository.findById(id)).thenReturn(Optional.of(existingTicket));

        ticketService.deleteTicket(id);

        verify(ticketRepository).findById(id);
        verify(ticketRepository).delete(existingTicket);
    }
}
