import { RxGraphQLReplicationQueryBuilderResponse } from "rxdb";
import { RxGraphQLReplicationState } from "rxdb/plugins/replication-graphql";
import { $replications } from "./store/replications";

async function setHeaders(replicationName: string) {
  const replications: {
    [key: string]: RxGraphQLReplicationState<unknown, unknown>;
  } = $replications.get();

  if (replications && replications[replicationName]) {
    const replication = replications[replicationName];
    const activeEmail = "m.rainer@webware.dev";
    replication.setHeaders({
      // authorization: `Bearer ${accessToken}`,
      user: JSON.stringify({
        email: activeEmail,
      }),
    });
  }
}

export const pullServicePlan = (
  checkpoint: object | undefined,
  limit: number,
): RxGraphQLReplicationQueryBuilderResponse => {
  setHeaders("service_plan");
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
                resort_id
                status_id
                owner_id
                ts_assigned
                ts_completed
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
  setHeaders("service_plan");
  const query = `
    mutation PushServicePlan($writeRows: [ServicePlanInputPushRow!]!) {
        pushServicePlan(writeRows: $writeRows) {
          deleted
          sp_id
          description
          resort_id
          status_id
          owner_id
          ts_assigned
          ts_completed
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
    setHeaders("service_plan");
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
                resort_id
                status_id
                owner_id
                ts_assigned
                ts_completed
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
  setHeaders("service_object");
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
              img_dev
              img_mnt
              latitude
              longitude
              machine_room_name
              master_so_id
              name
              position_number
              serial_number
              so_id
              sort_id
              sp_id
              status_id
              track_name
              ts_completed
              ts_updated
              type_id
              type_name
              ts_inserted
              vendor
              build_year
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
  setHeaders("service_object");
  const query = `
    mutation PushServiceObject($writeRows: [ServiceObjectInputPushRow!]!) {
        pushServiceObject(writeRows: $writeRows) {
          deleted
          description
          img_dev
          img_mnt
          latitude
          longitude
          machine_room_name
          master_so_id
          name
          position_number
          serial_number
          so_id
          sort_id
          sp_id
          status_id
          track_name
          ts_completed
          ts_updated
          type_id
          type_name
          ts_inserted
          vendor
          build_year
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
    setHeaders("service_object");
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
              img_dev
              img_mnt
              latitude
              longitude
              machine_room_name
              master_so_id
              name
              position_number
              serial_number
              so_id
              sort_id
              sp_id
              status_id
              track_name
              ts_completed
              ts_updated
              type_id
              type_name
              ts_inserted
              vendor
              build_year
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
