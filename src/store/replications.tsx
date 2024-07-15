import { atom } from "nanostores";
import { RxGraphQLReplicationState } from "rxdb/plugins/replication-graphql";

interface ReplicationsPayload {
  [key: string]: RxGraphQLReplicationState<unknown, unknown>;
}
export const $replications = atom<ReplicationsPayload>({});
