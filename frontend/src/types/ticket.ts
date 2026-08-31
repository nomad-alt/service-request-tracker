export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED'

export interface Ticket {
  id: number
  title: string
  description: string
  priority: Priority
  status: TicketStatus
  createdAt: string
  updatedAt: string
}

export interface TicketRequest {
  title: string
  description: string
  priority: Priority
}
