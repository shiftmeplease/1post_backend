import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const { connection } = mongoose;

export const dbStatus = {
  active: false,
  message: `initial state at ${new Date().toISOString()}`,
};

export let db = connection;
export let AutoIncrement = AutoIncrementFactory(connection);

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
    useCreateIndex: true,
    useFindAndModify: false,
  });

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
}
