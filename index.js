const ping = require("ping");
const cron = require("cron");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const { format } = require("date-fns");

const host = process.env.HOST || "google.com";

const getFileName = () => `./data/${format(new Date(), "dd-MM-yyyy")}.csv`;
const formatResult = (result) => ({
  date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  host: result.host || "not found",
  alive: result.alive || false,
  time: result.time || Infinity,
});

async function pingHost() {
  try {
    const result = await ping.promise.probe(host, {
      timeout: 10,
    });
    const data = formatResult(result);
    fs.writeFileSync(getFileName(), Object.values(data).join(",") + "\n", {
      flag: "a",
    });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

const job = new cron.CronJob(
  `*/${process.env.INTERVAL || 10} * * * * *`,
  pingHost
);
job.start();
