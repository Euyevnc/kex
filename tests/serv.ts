import fs from "fs";
import express from "express";

import Kex from "../src/index";

/* TYPES */
import type { CacheStore, TemplateFunction } from "./../src/compile";
/* END TYPES */

const app = express();
const host = "localhost";
const port = 8000;

app.use(express.static("public"));

let TEST_PREC_FIRST_REQ = true;
const kexEngine = new Kex();
const views = compileViews(kexEngine);

app.get("/test", async (req: any, res: any) => {
  const comments = JSON.parse(fs.readFileSync("tests/HNData.json", "utf8"));
  fs.writeFileSync("tests/serv-logs-cache.js", views.test.toString());

  const reqReceived = Date.now();
  let NOTICE_FOR_LOG = "kex, caching";

  res.status(200).send(views.test({ comments: comments }));

  const endProc = Date.now();
  fs.writeFile(
    "tests/serv-logs-caches.txt",

    `${
      TEST_PREC_FIRST_REQ ? "\n" : ""
    }Time: ${new Date().toLocaleString()}. Render duration: ${
      endProc - reqReceived
    }ms. Source: ${
      TEST_PREC_FIRST_REQ ? "render" : "cache"
    }. Details: ${NOTICE_FOR_LOG}\n`,

    { flag: "a+" },
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The logs was saved!");
    }
  );
  TEST_PREC_FIRST_REQ = false;
});

app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`);
});

function compileViews(kex: Kex) {
  const config = kex.getConfig();
  const viewNames = fs.readdirSync(config.viewsPath);
  const compiledViews: Record<string, (data: Record<string, any>) => string> =
    {};
  viewNames.forEach((viewName) => {
    compiledViews[viewName] = kex.compileView(viewName);
  });

  return compiledViews;
}

export {};
