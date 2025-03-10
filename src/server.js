import { app } from "./app.js";

const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
};

console.log(`Server running on port ${env.PORT.toString()}`);
console.log(`Environment: ${env.NODE_ENV}`);

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT.toString()}`);
});
