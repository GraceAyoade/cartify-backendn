import fs from "fs";
import path from "path";
import User from "../models/user.model";

async function seedData() {
  const data = fs.readFileSync(path.join("src", "data", "users.json"), {
    encoding: "utf8",
  });
  const userData = JSON.parse(data);

  for (let i = 0; i < userData.length; i++) {
    if (!(await User.findOne({ email: userData[i].email }))) {
      const user = new User(userData[i]);
      return user.save();
    }
  }
  console.log("Relevant data seeded");
}

export default seedData;
