import { config } from "./config";
import { createApp } from "./app";

const app = createApp();

app.listen(config.PORT, () => {
  console.log(`Server started on http://localhost:${config.PORT}`);
});
