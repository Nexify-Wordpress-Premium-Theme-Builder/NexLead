import "./load-env.js";

import type { Server } from "node:http";
import { createApp } from "./app";

const port = Number(process.env.PORT) || 4000;
const server: Server = createApp();

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} kullanımda. Eski süreci kapatın veya PORT değişkenini değiştirin.`);
    process.exit(1);
  }

  console.error("API sunucusu başlatılamadı:", error.message);
  process.exit(1);
});

server.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
