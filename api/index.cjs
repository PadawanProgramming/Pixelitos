/** Vercel serverless entry — forwards all requests to the Express app. */
module.exports = async (req, res) => {
  const { default: appPromise } = require("../dist/server.cjs");
  const app = await appPromise;
  return app(req, res);
};
