package com.example.servicerequesttracker.repository;

import com.example.servicerequesttracker.model.Priority;
import com.example.servicerequesttracker.model.Ticket;
import com.example.servicerequesttracker.model.TicketStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByPriority(Priority priority);
}
