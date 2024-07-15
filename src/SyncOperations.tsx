import { RxGraphQLReplicationQueryBuilderResponse } from "rxdb";

export const pullServicePlan = (
  checkpoint: object | undefined,
  limit: number,
): RxGraphQLReplicationQueryBuilderResponse => {
  if (!checkpoint) {
    checkpoint = {
      sp_id: "",
      ts_updated: 0,
      sort_id: 0,
    };
  }
  const query = `query PullServicePlan($checkpoint: ServicePlanCPInput!, $limit: Int!) {
        pullServicePlan(checkpoint: $checkpoint, limit: $limit) {
            documents {
                sp_id
                description
                ts_updated
                ts_inserted
                deleted
                sort_id
            }
            checkpoint {
                sp_id
                ts_updated
                sort_id
            }
        }
    }`;
  return {
    query,
    operationName: "PullServicePlan",
    variables: {
      checkpoint,
      limit,
    },
  };
};

export const pushServicePlan = (rows: unknown) => {
  const query = `
    mutation PushServicePlan($writeRows: [ServicePlanInputPushRow!]!) {
        pushServicePlan(writeRows: $writeRows) {
          deleted
          sp_id
          description
          ts_updated
          ts_inserted
          sort_id
        }
    }
    `;
  const variables = {
    writeRows: rows,
  };
  return {
    query,
    operationName: "PushServicePlan",
    variables,
  };
};

export const streamServicePlan =
  (): RxGraphQLReplicationQueryBuilderResponse => {
    const query = `
    subscription StreamServicePlan {
        streamServicePlan {
            checkpoint {
                sp_id
                ts_updated
                sort_id
            }
            documents {
                deleted
                sp_id
                description
                ts_updated
                ts_inserted
                sort_id
            }
        }
    }
    `;
    const variables = {};
    return {
      query,
      variables,
    };
  };

export const pullServiceObject = (
  checkpoint: object | undefined,
  limit: number,
): RxGraphQLReplicationQueryBuilderResponse => {
  if (!checkpoint) {
    checkpoint = {
      so_id: "",
      sp_id: "",
      ts_updated: 0,
      sort_id: 0,
    };
  }
  const query = `query PullServiceObject($checkpoint: ServiceObjectCPInput!, $limit: Int!) {
        pullServiceObject(checkpoint: $checkpoint, limit: $limit) {
            documents {
              deleted
              description
              so_id
              sort_id
              sp_id
              ts_updated
              ts_inserted
            }
            checkpoint {
                sp_id
                so_id
                ts_updated
                sort_id
            }
        }
    }`;
  return {
    query,
    operationName: "PullServiceObject",
    variables: {
      checkpoint,
      limit,
    },
  };
};

export const pushServiceObject = (
  rows: unknown,
): RxGraphQLReplicationQueryBuilderResponse => {
  const query = `
    mutation PushServiceObject($writeRows: [ServiceObjectInputPushRow!]!) {
        pushServiceObject(writeRows: $writeRows) {
          deleted
          description
          so_id
          sort_id
          sp_id
          ts_updated
          ts_inserted
        }
    }
    `;
  const variables = {
    writeRows: rows,
  };
  return {
    query,
    operationName: "PushServiceObject",
    variables,
  };
};
export const streamServiceObject =
  (): RxGraphQLReplicationQueryBuilderResponse => {
    const query = `
    subscription StreamServiceObject {
        streamServiceObject {
            checkpoint {
                sp_id
                so_id
                ts_updated
                sort_id
            }
            documents {
              deleted
              description
              so_id
              sort_id
              sp_id
              ts_updated
              ts_inserted
            }
        }
    }
    `;
    const variables = {};
    return {
      query,
      variables,
    };
  };
