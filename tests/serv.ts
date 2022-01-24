import fs from "fs";
import express from "express";

import Kex from "../src/index";
const app = express();
const host = "localhost";
const port = 8000;

app.use(express.static("public"));
const kexEngine = new Kex();
const views = compileViews(kexEngine);
import testAssets from "./blog-assets.js";

let TEST_PREC_FIRST_REQ = true;
const comments = JSON.parse(fs.readFileSync("tests/HNData.json", "utf8"));
app.get("/comments", async (req: any, res: any) => {
  const reqReceived = Date.now();
  let NOTICE_FOR_LOG = "kex, comments page, caching";

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

app.get("/blog", async (req: any, res: any) => {
  const PAGE_INDEX = 1;
  const PAGE_SIZE = 5;
  const response = await testAssets.getAsyncPosts({
    page: PAGE_INDEX - 1,
    pageSize: PAGE_SIZE,
    tag: null,
  });

  const reqReceived = Date.now();
  let NOTICE_FOR_LOG = "kex, blog page, caching";

  res.status(200).send(
    views.blog_main({
      postsList: response.content,
      meta: {
        pageIndex: PAGE_INDEX,
        totalPage: Math.ceil(response.meta.length / PAGE_SIZE),
        archive: response.meta.archive,
      },
    })
  );

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
