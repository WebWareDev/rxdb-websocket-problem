export const servicePlanSchema = {
  version: 0,
  primaryKey: "sp_id",
  type: "object",
  properties: {
    sp_id: {
      type: "string",
      maxLength: 80,
    },
    description: {
      type: "string",
    },
    ts_updated: {
      type: "string",
    },
    sort_id: {
      type: "integer",
    },
    ts_inserted: {
      type: "string",
    },
  },
  required: ["sp_id", "ts_updated", "ts_inserted", "sort_id"],
};
export const serviceObjectSchema = {
  version: 0,
  primaryKey: {
    key: "id",
    fields: ["sp_id", "so_id"],
    separator: "|",
  },
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 80, // <- the primary key must have set maxLength
    },
    sp_id: {
      type: "string",
    },
    so_id: {
      type: "string",
    },
    description: {
      type: "string",
    },
    ts_updated: {
      type: "string",
    },
    ts_inserted: {
      type: "string",
    },
    sort_id: {
      type: "integer",
    },
  },
  required: [
    "sp_id",
    "so_id",
    "ts_updated",
    "sort_id",
    "ts_inserted",
    "description",
  ],
};
