import React, { useEffect } from "react";
import Database from "./Database";
import { useStore } from "@nanostores/react";
import { $syncState, $appState } from "./store/app";
import { useNavigate } from "react-router-dom";

const initDB = async () => {
  const db = await Database.get();
  return db;
};

const getServicePlan = async () => {
  const db = await Database.get();
  const servicePlan = await db.service_plan
    .findOne()
    .where("sp_id")
    .eq("CHECKLIST_XXX_AM_2")
    .exec();
  return servicePlan;
};
const getServiceObject = async () => {
  const db = await Database.get();
  const serviceObject = await db.service_object
    .findOne()
    .where("sp_id")
    .eq("CHECKLIST_XXX_AM_2")
    .where("so_id")
    .eq("SO-00000092-XX")
    .exec();
  return serviceObject;
};

const initCurrentRecords = async (
  setCurrentServicePlan: any,
  setCurrentServiceObject: any,
  setLoaded: any,
) => {
  const servicePlan = await getServicePlan();
  if (servicePlan) {
    setCurrentServicePlan(servicePlan);
  }

  const serviceObject = await getServiceObject();
  if (serviceObject) {
    setCurrentServiceObject(serviceObject);
  }
  setLoaded(true);
};

const Home: React.FC = () => {
  const syncState = useStore($syncState);
  const navigate = useNavigate();
  let showDataReload = syncState == "APP_RECEIVED_NEW_DATA";
  const [currentServicePlan, setCurrentServicePlan] = React.useState<any>(null);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [currentServiceObject, setCurrentServiceObject] =
    React.useState<any>(null);
  const appState = useStore($appState);

  const handlePageReload = () => {
    navigate(0);
  };

  useEffect(() => {
    if (appState === "INIT") {
      initDB();
    }
    if (appState === "READY") {
      initCurrentRecords(
        setCurrentServicePlan,
        setCurrentServiceObject,
        setLoaded,
      );
    }
  }, [appState]);

  if (appState !== "READY") {
    return <div>Loading...</div>;
  }
  const updateServicePlan = async () => {
    const descr =
      currentServicePlan._data.description === "testx" ? "testy" : "testx";
    const newServicePlan = await currentServicePlan.incrementalModify(
      (doc: any) => {
        const newData = {
          ...doc,
          description: descr,
        };
        return newData;
      },
    );
    setCurrentServicePlan(newServicePlan);
  };

  const updateServiceObject = async () => {
    const descr =
      currentServiceObject._data.description === "test_so_x"
        ? "test_so_y"
        : "test_so_x";
    const newServiceObject = await currentServiceObject.incrementalModify(
      (doc: any) => {
        const newData = {
          ...doc,
          description: descr,
        };
        return newData;
      },
    );
    setCurrentServiceObject(newServiceObject);
  };

  return (
    <>
      {loaded && (
        <div style={{ marginBottom: "40px", display: "flex" }}>
          <div>
            {currentServicePlan._data.description}
            <br />
            <button onClick={updateServicePlan}>Update Service Plan</button>
          </div>
          <div>
            {currentServiceObject._data.description}
            <br />
            <button onClick={updateServiceObject}>Update Service Object</button>
          </div>
        </div>
      )}

      <div>
        {showDataReload && <button onClick={handlePageReload}>Refresh</button>}
      </div>
    </>
  );
};

export default Home;
