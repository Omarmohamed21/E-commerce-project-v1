import mongoose from "mongoose";

export const connectionDB = async () => {
  return await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => console.log("DB Connected"))
    .catch(() => console.log("DB failed to connect"));
};
