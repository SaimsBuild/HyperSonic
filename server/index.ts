import express, { type Request, Response, NextFunction } from "express";
import { readFileSync } from "fs";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Load configuration
let config;
try {
  const configData = readFileSync('./config.json', 'utf8');
  config = JSON.parse(configData);
} catch (error) {
  // Fallback configuration if config.json doesn't exist or is invalid
  config = {
    server: {
      host: "0.0.0.0",
      port: 5000
    },
    app: {
      name: "Hypersonic Habit Tracker",
      description: "A web-based self-discipline and habit tracker with Bangladesh timezone integration"
    }
  };
  log("Warning: Could not load config.json, using default configuration");
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use configuration for host and port, with environment variable override
  const port = parseInt(process.env.PORT || config.server.port.toString(), 10);
  const host = config.server.host;
  
  server.listen({
    port,
    host,
    reusePort: true,
  }, () => {
    log(`${config.app.name} serving on ${host}:${port}`);
    log(`App description: ${config.app.description}`);
  });
})();
