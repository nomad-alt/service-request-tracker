package com.example.servicerequesttracker.service;

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

    public Ticket createTicket(String title, String description, Priority priority) {
        Ticket ticket = new Ticket(title, description, priority);
        return ticketRepository.save(ticket);
    }

    @Transactional(readOnly = true)
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Ticket> getTicketsByPriority(Priority priority) {
        return ticketRepository.findByPriority(priority);
    }

    @Transactional(readOnly = true)
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    public Ticket updateTicket(Long id, String title, String description, Priority priority) {
        Ticket ticket = getTicketById(id);
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setPriority(priority);

        return ticketRepository.save(ticket);
    }

    public Ticket updateStatus(Long id, TicketStatus status) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        Ticket ticket = getTicketById(id);
        ticketRepository.delete(ticket);
    }
}
