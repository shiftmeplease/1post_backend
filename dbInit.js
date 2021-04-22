import mongoose from "mongoose";

export const dbStatus = {
  active: false,
  message: `initial state at ${new Date().toISOString()}`,
};
export let db = {};

function switchStatus(action) {
  const info = `${action} at ${new Date().toISOString()}`;
  dbStatus.message = info;

  switch (action) {
    case "connected":
    case "reconnected":
    case "open":
      dbStatus.active = true;
      break;
    case "disconnected":
    case "error":
      dbStatus.active = false;
      break;
  }
}

export function connectToMongo(mongoUrl) {
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = mongoose.connection;

  db.on("error", (err) => {
    console.log(err.message);
    switchStatus("error");
  });
  db.on("disconnected", () => {
    switchStatus("disconnected");
  });
  db.on("reconnected", () => {
    switchStatus("reconnected");
  });
  db.on("open", () => {
    switchStatus("open");
  });

  return { db, dbStatus };
}
