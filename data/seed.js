import fs from "fs";
import path from "path";
import userModel from "../models/userModel.js";

async function seedData() {
  const data = fs.readFileSync(path.join("data", "users.json"), {
    encoding: "utf8",
  });
  const userData = JSON.parse(data);

  for (let i = 0; i < userData.length; i++) {
    if (!(await userModel.findOne({ email: userData[i].email }))) {
      const user = new userModel(userData[i]);
      return user.save();
    }
  }
  console.log("Relevant data seeded");
}

export default seedData;
