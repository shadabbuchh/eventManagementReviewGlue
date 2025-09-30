/**
 * ⚠️  AUTO-GENERATED FILE - DO NOT MODIFY ⚠️
 *
 * This file contains TypeScript types generated from OpenAPI specifications.
 * Use these types for type-safe API development.
 */

export interface paths {
    "/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List events with status, next occurrence, quick actions and notification badge
         * @description Returns a paginated list of events. Supports search by name or tag, and filtering by status. Each event includes status (draft/published/archived), the next occurrence datetime (if any), and a flag for unread notifications.
         *
         */
        get: operations["listEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{eventId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get event detail
         * @description Retrieve the full details for a single event. Used when a user opens an event from the list.
         */
        get: operations["getEvent"];
        /**
         * Update an event
         * @description Update fields of an existing event (quick edit from list or full edit page).
         */
        put: operations["updateEvent"];
        post?: never;
        /**
         * Archive or delete an event
         * @description Archive (soft delete) or permanently remove an event. By default archives the event unless query param permanent=true is provided.
         */
        delete: operations["deleteEvent"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{eventId}/duplicate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Duplicate an event
         * @description Create a copy of the specified event. The duplicate will be created in draft status.
         */
        post: operations["duplicateEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{eventId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Cancel an event occurrence or the whole event
         * @description Cancel a specific upcoming occurrence or mark the whole event as canceled/archived. Returns the updated event.
         */
        post: operations["cancelEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{eventId}/quick-actions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Perform a quick action on an event (edit, view, duplicate, cancel)
         * @description Execute a quick action for an event as shown in list quick actions. The action will be validated server side.
         */
        post: operations["eventQuickAction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ErrorResponse: {
            code: string;
            message: string;
            details?: string;
            fieldErrors?: {
                field?: string;
                message?: string;
            }[];
        };
        Event: {
            id: string;
            name: string;
            description?: string;
            /**
             * @description Event status
             * @enum {string}
             */
            status: "draft" | "published" | "archived";
            /**
             * Format: date-time
             * @description Next scheduled occurrence datetime if any
             */
            nextOccurrence?: string | null;
            occurrences?: string[];
            tags?: string[];
            /** @description Whether the event has unread notifications (for badge in UI) */
            unreadNotifications?: boolean;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        EventListResponse: {
            data: components["schemas"]["Event"][];
            meta: {
                page?: number;
                pageSize?: number;
                totalPages?: number;
                totalItems?: number;
            };
        };
        EventCreateRequest: {
            name: string;
            description?: string;
            /** @enum {string} */
            status?: "draft" | "published";
            occurrences?: string[];
            tags?: string[];
        };
        EventUpdateRequest: {
            name?: string;
            description?: string;
            /** @enum {string} */
            status?: "draft" | "published" | "archived";
            occurrences?: string[];
            tags?: string[];
        };
    };
    responses: {
        /** @description Invalid request */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Resource not found */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Conflict (concurrent update or duplicate) */
        Conflict: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Validation failed */
        UnprocessableEntity: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listEvents: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                pageSize?: number;
                /** @description Search query to match event name */
                q?: string;
                /** @description Filter by tag value */
                tag?: string;
                /** @description Filter by event status */
                status?: "draft" | "published" | "archived";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated list of events */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventListResponse"];
                };
            };
            400: components["responses"]["BadRequest"];
        };
    };
    getEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Event detail retrieved */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            404: components["responses"]["NotFound"];
        };
    };
    updateEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                eventId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EventUpdateRequest"];
            };
        };
        responses: {
            /** @description Event successfully updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
        };
    };
    deleteEvent: {
        parameters: {
            query?: {
                /** @description If true, permanently deletes the event. Otherwise archives it. */
                permanent?: boolean;
            };
            header?: never;
            path: {
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Event archived/deleted successfully (no content) */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
        };
    };
    duplicateEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                eventId: string;
            };
            cookie?: never;
        };
        /** @description Optional overrides for the duplicated event (e.g., name) */
        requestBody?: {
            content: {
                "application/json": {
                    name?: string;
                    tags?: string[];
                };
            };
        };
        responses: {
            /** @description Event duplicated successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
        };
    };
    cancelEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @description Datetime of the occurrence to cancel. If omitted, the entire event will be canceled/archived. */
                    occurrence?: string;
                    reason?: string;
                };
            };
        };
        responses: {
            /** @description Event cancelled/updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"];
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
        };
    };
    eventQuickAction: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                eventId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @enum {string} */
                    action: "edit" | "view" | "duplicate" | "cancel";
                    /** @description Optional payload for the action (e.g., fields to update for edit, occurrence for cancel) */
                    payload?: Record<string, never>;
                };
            };
        };
        responses: {
            /** @description Action executed successfully. Response varies by action. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Event"] | {
                        message?: string;
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            404: components["responses"]["NotFound"];
        };
    };
}
