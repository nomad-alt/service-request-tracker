import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import type { Priority, TicketRequest } from "../types/ticket";

interface FormErrors {
  title?: string;
  description?: string;
  priority?: string;
}

function CreateTicketPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [pendingRequest, setPendingRequest] =
    useState<TicketRequest | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (!description.trim()) {
      nextErrors.description = "Description is required";
    }

    if (!priority) {
      nextErrors.priority = "Priority is required";
    }

    setErrors(nextErrors);
    setPendingRequest(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!priority) {
      return;
    }

    const request: TicketRequest = {
      title: title.trim(),
      description: description.trim(),
      priority,
    };

    setPendingRequest(request);
  }

  return (
    <div className="dashboard">
      <h2>Create Ticket</h2>
      <p className="page-description">
        Complete the form to submit a new service request.
      </p>

      <form className="ticket-form" noValidate onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="ticket-title">Title</label>
          <input
            id="ticket-title"
            type="text"
            required
            maxLength={200}
            value={title}
            aria-describedby={errors.title ? "ticket-title-error" : undefined}
            aria-invalid={Boolean(errors.title)}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
          {errors.title && (
            <p className="form-error" id="ticket-title-error">
              {errors.title}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="ticket-description">Description</label>
          <textarea
            id="ticket-description"
            required
            maxLength={4000}
            value={description}
            aria-describedby={
              errors.description ? "ticket-description-error" : undefined
            }
            aria-invalid={Boolean(errors.description)}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
          {errors.description && (
            <p className="form-error" id="ticket-description-error">
              {errors.description}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="ticket-priority">Priority</label>
          <select
            id="ticket-priority"
            required
            value={priority}
            aria-describedby={
              errors.priority ? "ticket-priority-error" : undefined
            }
            aria-invalid={Boolean(errors.priority)}
            onChange={(event) =>
              setPriority(event.currentTarget.value as Priority | "")
            }
          >
            <option value="">Select priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          {errors.priority && (
            <p className="form-error" id="ticket-priority-error">
              {errors.priority}
            </p>
          )}
        </div>

        <div className="form-actions">
          <button className="primary-action" type="submit">
            Create ticket
          </button>
          <Link className="secondary-action" to="/">
            Cancel
          </Link>
        </div>

        {pendingRequest && (
          <p className="submit-success" role="status">
            Ticket is ready to submit.
          </p>
        )}
      </form>
    </div>
  );
}

export default CreateTicketPage;
