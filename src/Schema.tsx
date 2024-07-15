export const servicePlanSchema = {
  version: 0,
  primaryKey: "sp_id",
  type: "object",
  properties: {
    sp_id: {
      type: "string",
      maxLength: 20,
    },
    description: {
      type: "string",
    },
    resort_id: {
      type: "string",
    },
    status_id: {
      type: "integer",
    },
    owner_id: {
      type: "integer",
    },
    ts_completed: {
      type: "string",
    },
    ts_assigned: {
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
  required: ["sp_id", "resort_id", "ts_updated", "ts_inserted", "sort_id"],
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
      maxLength: 40, // <- the primary key must have set maxLength
    },
    sp_id: {
      type: "string",
    },
    so_id: {
      type: "string",
    },
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    type_id: {
      type: "string",
    },
    type_name: {
      type: "string",
    },
    master_so_id: {
      type: "string",
    },
    status_id: {
      type: "integer",
    },
    serial_number: {
      type: "string",
    },
    latitude: {
      type: "float",
    },
    longitude: {
      type: "float",
    },
    track_name: {
      type: "string",
    },
    position_number: {
      type: "string",
    },
    machine_room_name: {
      type: "string",
    },
    img_dev: {
      type: "string",
    },
    img_mnt: {
      type: "string",
    },
    ts_completed: {
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
    vendor: {
      type: "string",
    },
    build_year: {
      type: "string",
    },
  },
  required: [
    "sp_id",
    "so_id",
    "name",
    "ts_updated",
    "sort_id",
    "ts_inserted",
    "description",
    "master_so_id",
  ],
};

export const serviceCheckSchema = {
  version: 1,
  primaryKey: {
    key: "id",
    fields: ["sc_id", "sp_id", "so_id"],
    separator: "|",
  },
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 40,
    },
    sc_id: {
      type: "string",
    },
    sp_id: {
      type: "string",
    },
    so_id: {
      type: "string",
    },
    input_value: {
      type: "string",
    },
    max_value: {
      type: "string",
    },
    min_value: {
      type: "string",
    },
    nominal_code: {
      type: "string",
    },
    unit_of_measure_code: {
      type: "string",
    },
    ts_updated: {
      type: "string",
    },
    sort_id: {
      type: "integer",
    },
    status_id: {
      type: "integer",
    },
  },
  required: ["sc_id", "sp_id", "so_id", "ts_updated", "sort_id", "status_id"],
};
