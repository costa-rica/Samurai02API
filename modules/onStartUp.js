const { User } = require("samurai02db");

const bcrypt = require("bcrypt");
const fs = require("fs");

async function onStartUpCreateEnvUsers() {
  if (!process.env.ADMIN_EMAIL_CREATE_ON_STARTUP) {
    console.warn("⚠️ No admin emails found in env variables.");
    return;
  }

  let adminEmails;
  try {
    adminEmails = JSON.parse(process.env.ADMIN_EMAIL_CREATE_ON_STARTUP);
    if (!Array.isArray(adminEmails)) throw new Error();
  } catch (error) {
    console.error(
      "❌ Error parsing ADMIN_EMAIL_CREATE_ON_STARTUP. Ensure it's a valid JSON array."
    );
    return;
  }

  for (const email of adminEmails) {
    try {
      const existingUser = await User.findOne({ where: { email } });

      if (!existingUser) {
        console.log(`🔹 Creating admin user: ${email}`);

        const hashedPassword = await bcrypt.hash("test", 10); // Default password, should be changed later.

        const newUser = await User.create({
          username: email.split("@")[0],
          email,
          password: hashedPassword,
          isAdmin: true, // Set admin flag
        });

        console.log(`✅ Admin user created: ${email}`);
      } else {
        console.log(`🔸 User already exists: ${email}`);
      }
    } catch (err) {
      console.error(`❌ Error creating admin user (${email}):`, err);
    }
  }
}

function verifyCheckDirectoryExists() {
  // add directory paths to check (and create if they don't exist)
  const pathsToCheck = [process.env.PATH_DATABASE];

  pathsToCheck.forEach((dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
  });
}

module.exports = { onStartUpCreateEnvUsers, verifyCheckDirectoryExists };
