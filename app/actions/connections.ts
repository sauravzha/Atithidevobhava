"use server";

/**
 * Server Actions for Meet a Local Connections and Mutual Contact Exchange.
 * Spec reference: Section 6 and Section 9 of docs/SPEC.md.
 */

import {
  createConnectionRequestSchema,
  declineConnectionSchema,
  scheduleConnectionSchema,
  contactExchangeConsentSchema,
  type CreateConnectionRequestInput,
  type DeclineConnectionInput,
  type ScheduleConnectionInput,
  type ContactExchangeConsentInput,
} from "@/lib/validation/connection";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export type ConnectionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "WITHDRAWN"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";

export interface StoredConnection {
  id: string;
  travellerId: string;
  localMemberId: string;
  travellerName: string;
  localMemberName: string;
  purpose: string;
  suggestedPublicPlace: string;
  proposedDates: string;
  initialMessage: string;
  status: ConnectionStatus;
  declineReason?: string;
  idempotencyKey: string;
  scheduledAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  contactExchange?: {
    travellerConfirmed: boolean;
    localConfirmed: boolean;
    bothConfirmed: boolean;
    travellerSharedChannels: { email?: string; phone?: string; whatsapp?: string };
    localSharedChannels: { email?: string; phone?: string; whatsapp?: string };
  };
}

// In-memory runtime connection store for local development/testing
const connectionsStore = new Map<string, StoredConnection>();

// Seed a default pilot connection for testing and development demo
connectionsStore.set("conn-demo-01", {
  id: "conn-demo-01",
  travellerId: "usr-traveller-01",
  localMemberId: "loc-br-01",
  travellerName: "Sarah Jenkins",
  localMemberName: "Amarnath Mishra",
  purpose: "tea_or_coffee",
  suggestedPublicPlace: "Kameshwar Singh Sanskrit University campus tea stall",
  proposedDates: "Next Saturday morning, around 10:00 AM",
  initialMessage:
    "Namaste Amarnath ji. I am visiting Darbhanga to learn about Mithila oral traditions and classical music history. I would be honored to meet for tea at the university campus tea stall to hear your perspectives.",
  status: "ACCEPTED",
  idempotencyKey: "idem_demo_init_01",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  contactExchange: {
    travellerConfirmed: true,
    localConfirmed: false,
    bothConfirmed: false,
    travellerSharedChannels: { email: "sarah.j@example.com" },
    localSharedChannels: {},
  },
});

/**
 * Create a new connection request (Product A: Meet a Local).
 */
export async function createConnectionRequestAction(
  input: CreateConnectionRequestInput
): Promise<ActionResult<{ connectionId: string }>> {
  try {
    const parseResult = createConnectionRequestSchema.safeParse(input);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      return { success: false, error: issue?.message || "Invalid connection request data." };
    }

    const {
      recipientId,
      purpose,
      proposedDates,
      suggestedPublicPlace,
      initialMessage,
      idempotencyKey,
    } = parseResult.data;

    // Idempotency check: if connection with same key exists, return it
    for (const conn of connectionsStore.values()) {
      if (conn.idempotencyKey === idempotencyKey) {
        return {
          success: true,
          message: "Connection request already submitted.",
          data: { connectionId: conn.id },
        };
      }
    }

    // Constraint: Only ONE active connection per pair (status IN PENDING, ACCEPTED, SCHEDULED)
    const simulatedCurrentUserId = "usr-current-traveller";
    for (const conn of connectionsStore.values()) {
      if (
        conn.travellerId === simulatedCurrentUserId &&
        conn.localMemberId === recipientId &&
        ["PENDING", "ACCEPTED", "SCHEDULED"].includes(conn.status)
      ) {
        return {
          success: false,
          error: "You already have an active connection request with this member.",
        };
      }
    }

    const connectionId = "conn-" + Date.now().toString(36);
    const newConnection: StoredConnection = {
      id: connectionId,
      travellerId: simulatedCurrentUserId,
      localMemberId: recipientId,
      travellerName: "Visiting Traveller",
      localMemberName: "Local Resident",
      purpose,
      suggestedPublicPlace,
      proposedDates,
      initialMessage,
      status: "PENDING",
      idempotencyKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contactExchange: {
        travellerConfirmed: false,
        localConfirmed: false,
        bothConfirmed: false,
        travellerSharedChannels: {},
        localSharedChannels: {},
      },
    };

    connectionsStore.set(connectionId, newConnection);

    return {
      success: true,
      message: "Connection request sent. The local member will review your request.",
      data: { connectionId },
    };
  } catch (err) {
    return {
      success: false,
      error: "Unable to create connection request. Please try again.",
    };
  }
}

/**
 * Accept a pending connection request (Local Member only).
 */
export async function acceptConnectionAction(
  connectionId: string
): Promise<ActionResult> {
  const conn = connectionsStore.get(connectionId);
  if (!conn) {
    return { success: false, error: "Connection request not found." };
  }

  if (conn.status !== "PENDING") {
    return {
      success: false,
      error: `Cannot accept connection currently in ${conn.status} status.`,
    };
  }

  conn.status = "ACCEPTED";
  conn.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Connection request accepted. Private messaging and contact exchange are now open.",
  };
}

/**
 * Decline a pending connection request.
 * Traveller sees only "unable to meet this request".
 */
export async function declineConnectionAction(
  input: DeclineConnectionInput
): Promise<ActionResult> {
  const parseResult = declineConnectionSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "Invalid decline parameters." };
  }

  const conn = connectionsStore.get(input.connectionId);
  if (!conn) {
    return { success: false, error: "Connection request not found." };
  }

  if (conn.status !== "PENDING") {
    return {
      success: false,
      error: `Cannot decline connection in ${conn.status} status.`,
    };
  }

  conn.status = "DECLINED";
  conn.declineReason = input.declineReason;
  conn.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Request declined politely. The traveller will see that you are unable to meet.",
  };
}

/**
 * Withdraw a pending connection request (Traveller only).
 */
export async function withdrawConnectionAction(
  connectionId: string
): Promise<ActionResult> {
  const conn = connectionsStore.get(connectionId);
  if (!conn) {
    return { success: false, error: "Connection request not found." };
  }

  if (conn.status !== "PENDING") {
    return {
      success: false,
      error: `Cannot withdraw request in ${conn.status} status.`,
    };
  }

  conn.status = "WITHDRAWN";
  conn.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Connection request withdrawn.",
  };
}

/**
 * Schedule an accepted meetup (agreed date and public venue).
 */
export async function scheduleConnectionAction(
  input: ScheduleConnectionInput
): Promise<ActionResult> {
  const parseResult = scheduleConnectionSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return { success: false, error: issue?.message || "Invalid schedule data." };
  }

  const conn = connectionsStore.get(input.connectionId);
  if (!conn) {
    return { success: false, error: "Connection not found." };
  }

  if (conn.status !== "ACCEPTED") {
    return {
      success: false,
      error: `Cannot schedule connection in ${conn.status} status. Must be ACCEPTED.`,
    };
  }

  conn.status = "SCHEDULED";
  conn.scheduledAt = input.scheduledAt;
  conn.suggestedPublicPlace = input.confirmedPublicPlace;
  conn.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Meetup scheduled successfully at the designated public venue.",
  };
}

/**
 * Complete a scheduled meetup (opens blind review window).
 */
export async function completeConnectionAction(
  connectionId: string
): Promise<ActionResult> {
  const conn = connectionsStore.get(connectionId);
  if (!conn) {
    return { success: false, error: "Connection not found." };
  }

  if (conn.status !== "SCHEDULED") {
    return {
      success: false,
      error: `Cannot mark as completed from ${conn.status} status. Must be SCHEDULED.`,
    };
  }

  conn.status = "COMPLETED";
  conn.completedAt = new Date().toISOString();
  conn.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Meetup marked as completed. The blind review window is now open.",
  };
}

/**
 * Cancel a scheduled or accepted connection.
 */
export async function cancelConnectionAction(
  connectionId: string
): Promise<ActionResult> {
  const conn = connectionsStore.get(connectionId);
  if (!conn) {
    return { success: false, error: "Connection not found." };
  }

  if (!["ACCEPTED", "SCHEDULED"].includes(conn.status)) {
    return {
      success: false,
      error: `Cannot cancel connection in ${conn.status} status.`,
    };
  }

  conn.status = "CANCELLED";
  conn.cancelledAt = new Date().toISOString();
  conn.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Connection cancelled.",
  };
}

/**
 * Record contact exchange consent for one party.
 * Contact details are revealed ONLY when BOTH parties confirm.
 */
export async function updateContactExchangeConsentAction(
  input: ContactExchangeConsentInput,
  role: "traveller" | "local"
): Promise<ActionResult<{ bothConfirmed: boolean }>> {
  const parseResult = contactExchangeConsentSchema.safeParse(input);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0];
    return { success: false, error: issue?.message || "Invalid contact exchange data." };
  }

  const conn = connectionsStore.get(input.connectionId);
  if (!conn) {
    return { success: false, error: "Connection not found." };
  }

  if (!["ACCEPTED", "SCHEDULED"].includes(conn.status)) {
    return {
      success: false,
      error: "Contact exchange is available only for accepted or scheduled meetups.",
    };
  }

  if (!conn.contactExchange) {
    conn.contactExchange = {
      travellerConfirmed: false,
      localConfirmed: false,
      bothConfirmed: false,
      travellerSharedChannels: {},
      localSharedChannels: {},
    };
  }

  if (role === "traveller") {
    conn.contactExchange.travellerConfirmed = true;
    conn.contactExchange.travellerSharedChannels = {
      email: input.shareEmail ? input.emailValue || "traveller@example.com" : undefined,
      phone: input.sharePhone ? input.phoneValue || "+919876543210" : undefined,
      whatsapp: input.shareWhatsapp ? input.whatsappValue || "+919876543210" : undefined,
    };
  } else {
    conn.contactExchange.localConfirmed = true;
    conn.contactExchange.localSharedChannels = {
      email: input.shareEmail ? input.emailValue || "local@example.com" : undefined,
      phone: input.sharePhone ? input.phoneValue || "+919876543210" : undefined,
      whatsapp: input.shareWhatsapp ? input.whatsappValue || "+919876543210" : undefined,
    };
  }

  // Dual consent verification
  const bothConfirmed =
    conn.contactExchange.travellerConfirmed && conn.contactExchange.localConfirmed;
  conn.contactExchange.bothConfirmed = bothConfirmed;

  return {
    success: true,
    message: bothConfirmed
      ? "Both parties have confirmed! Contact details are now revealed."
      : "Your contact preference has been saved. Waiting for the other person to confirm.",
    data: { bothConfirmed },
  };
}

/**
 * Fetch a connection by ID.
 */
export async function getConnectionById(
  connectionId: string
): Promise<StoredConnection | undefined> {
  return connectionsStore.get(connectionId);
}

/**
 * List all connections.
 */
export async function listUserConnections(): Promise<StoredConnection[]> {
  return Array.from(connectionsStore.values());
}
