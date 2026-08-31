package com.example.servicerequesttracker.service;

import com.example.servicerequesttracker.dto.TicketRequest;
import com.example.servicerequesttracker.dto.TicketResponse;
import com.example.servicerequesttracker.exception.TicketNotFoundException;
import com.example.servicerequesttracker.model.Priority;
import com.example.servicerequesttracker.model.Ticket;
import com.example.servicerequesttracker.model.TicketStatus;
import com.example.servicerequesttracker.repository.TicketRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public TicketResponse createTicket(TicketRequest request) {
        Ticket ticket = new Ticket(
                request.title(),
                request.description(),
                request.priority());

        return toResponse(ticketRepository.save(ticket));
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTicketsByPriority(Priority priority) {
        return ticketRepository.findByPriority(priority)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id) {
        return toResponse(findTicketEntity(id));
    }

    public TicketResponse updateTicket(Long id, TicketRequest request) {
        Ticket ticket = findTicketEntity(id);
        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setPriority(request.priority());

        return toResponse(ticketRepository.save(ticket));
    }

    public TicketResponse updateStatus(Long id, TicketStatus status) {
        Ticket ticket = findTicketEntity(id);
        ticket.setStatus(status);
        return toResponse(ticketRepository.save(ticket));
    }

    public void deleteTicket(Long id) {
        Ticket ticket = findTicketEntity(id);
        ticketRepository.delete(ticket);
    }

    private TicketResponse toResponse(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt());
    }

    private Ticket findTicketEntity(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }
}
