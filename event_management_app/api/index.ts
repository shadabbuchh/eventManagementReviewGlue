let appPromise: Promise<any> | null = null;

async function getApp() {
  if (!appPromise) {
    appPromise = (async () => {
      const { default: build } = await import("../backend/dist/app.js");
      const app = await build();
      await app.ready();
      return app;
    })();
  }
  return appPromise;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
  app.server.emit("request", req, res);
}
