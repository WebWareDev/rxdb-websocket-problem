import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import {
  createRxDatabase,
  addRxPlugin,
  RxError,
  RxCollection,
  RxDatabase,
  removeRxDatabase,
} from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import {
  RxGraphQLReplicationState,
  replicateGraphQL,
} from "rxdb/plugins/replication-graphql";
import { $replications } from "./store/replications";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration-schema";
import { servicePlanSchema, serviceObjectSchema } from "./Schema";
import { $syncState } from "./store/app";
import {
  pullServicePlan,
  pushServicePlan,
  streamServicePlan,
  pushServiceObject,
  pullServiceObject,
  streamServiceObject,
} from "./SyncOperations";

if (import.meta.env.MODE === "development") {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBMigrationPlugin);

if (import.meta.env.mode !== "development") {
  addRxPlugin(RxDBLeaderElectionPlugin);
}
addRxPlugin(RxDBQueryBuilderPlugin);

let dbPromise: unknown = null;
let globalDb: RxDatabase | null = null;
declare global {
  interface Window {
    db: RxDatabase;
  }
}
export const startReplications = async () => {
  const replications: {
    [key: string]: RxGraphQLReplicationState<unknown, unknown>;
  } = $replications.get();
  if (replications) {
    Object.values(replications).forEach(async (replication) => {
      replication?.start();
      replication.received$.subscribe(() =>
        $syncState.set("APP_RECEIVED_NEW_DATA"),
      );
    });
  }
};

const _create = async (forceRefresh: boolean = false) => {
  const db = await initRxDB(forceRefresh);
  return db;
};
const initDB = async (forceReset: boolean = false) => {
  const dbName = "test_db";
  if (forceReset) {
    await globalDb?.destroy();
    await removeRxDatabase(dbName, getRxStorageDexie());
  }

  const db = await createRxDatabase({
    name: dbName,
    storage: getRxStorageDexie(),
  });
  globalDb = db;

  if (import.meta.env.DEV) {
    window["db"] = db; // write to window for debugging

    db.waitForLeadership().then(() => {
      document.title = "♛ " + document.title;
    });
  }
  return db;
};
const initCollections = async (db) => {
  try {
    return await db.addCollections({
      service_plan: {
        schema: servicePlanSchema,
      },
      service_object: {
        schema: serviceObjectSchema,
      },
    });
  } catch (err) {
    if (err instanceof RxError) {
      const code = err.code;
      if (code === "DB6") {
        // force reset, makes fullsync after schema error
        get(true);
      }
    }
  }
};

const get = (forceReset: boolean = false) => {
  if (!dbPromise || forceReset) dbPromise = _create(forceReset);
  return dbPromise;
};
async function initRxDB(forceReset: boolean = false) {
  const batchSize = 300;
  const activeEmail = "m.rainer@webware.dev";
  // todo exception handling when idtokenclaims not present
  const defaultRepSettings = {
    url: {
      http: import.meta.env.VITE_API_URL,
      ws: import.meta.env.VITE_WS_API,
    },
    headers: {
      // authorization: `Bearer ${accessToken}`,
      user: JSON.stringify({
        email: activeEmail,
      }),
    },
    deletedField: "deleted",
    live: true,
    autoStart: false,
    replicationIdentifier: import.meta.env.VITE_API_URL,
    waitForLeadership: true,
    // credentials: 'include',
  };

  const db = await initDB(forceReset);
  await initCollections(db);

  const replicateCollection = (
    collection: RxCollection,
    replicationConfig: object,
  ) => {
    const replication = replicateGraphQL({
      ...defaultRepSettings,
      collection,
      ...replicationConfig,
    });
    replication.error$.subscribe(handleReplicationError);
    return replication;
  };
  const handleReplicationError = async (err: RxError) => {
    console.log("Got replication error:", err);
  };
  const replicationConfigs = [
    {
      collection: db.service_plan,
      push: {
        batchSize: batchSize,
        queryBuilder: pushServicePlan,
      },
      pull: {
        batchSize: batchSize,
        queryBuilder: pullServicePlan,
        streamQueryBuilder: streamServicePlan,
        includeWsHeaders: true,
      },
    },
    {
      collection: db.service_object,
      push: {
        batchSize: batchSize,
        queryBuilder: pushServiceObject,
        modifier: (doc: unknown) => {
          if (doc.id) {
            delete doc.id;
          }
          if (doc.position_number) {
            doc.position_number = parseInt(doc.position_number);
          }
          if (doc.build_year) {
            doc.build_year = parseInt(doc.build_year);
          }
          return doc;
        },
      },
      pull: {
        batchSize: batchSize,
        queryBuilder: pullServiceObject,
        streamQueryBuilder: streamServiceObject,
        includeWsHeaders: true,
        modifier: (doc: unknown) => {
          if (doc.position_number) {
            doc.position_number = doc.position_number.toString();
          }
          if (doc.build_year) {
            doc.build_year = doc.build_year.toString();
          }
          return doc;
        },
      },
    },
  ];

  const updatedReplications: {
    [key: string]: RxGraphQLReplicationState<unknown, unknown>;
  } = {};
  replicationConfigs.forEach(
    (config) =>
      (updatedReplications[config.collection.name] = replicateCollection(
        config.collection,
        config,
      )),
  );
  $replications.set(updatedReplications);
  startReplications();
  return db;
}
export default {
  get,
};
