// log-message.model.ts
export interface LogMessage {
    id: number;
    message: string;
    timestamp: string; // Use string to represent LocalDateTime
  }
  