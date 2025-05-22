import { startServer as startServerFromModule } from "./server";

export function startServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      startServerFromModule();

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
