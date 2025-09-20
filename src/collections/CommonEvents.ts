import { isEvents } from "@/access/isEvents";
import type { CollectionConfig } from "payload";

export const CommonEvents: CollectionConfig = {
    slug: "common-events",
    admin: {
        useAsTitle: "name",
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "description",
            type: "textarea",
            required: false,
        },
        {
            name: "upcomingDates",
            type: "array",
            required: false,
            fields: [
                {
                    name: "date",
                    type: "date",
                    required: true,
                },
                {
                    name: "notes",
                    type: "text",
                    required: false,
                },
            ],
            minRows: 0,
            maxRows: 50,
        },
    ],
    access: {
        create: isEvents,
        update: isEvents,
        delete: isEvents,
        read: () => true,
    },
    versions: {
        drafts: true,
    },
};


