import fs from "fs";
import express from "express";
import Kex from "../src/index";

const app = express();
const host = "localhost";
const port = 8000;

app.use(express.static("public"));

let TEST_PREC_FIRST_REQ = true;
const kex = new Kex();
app.get("/tests-precomp", async (req: any, res: any) => {
  const reqReceived = Date.now();
  let NOTICE_FOR_LOG = "kex";

  const parsedComments = JSON.parse(
    fs.readFileSync("tests/HNData.json", "utf8")
  );

  res.status(200).send();

  fs.writeFile(
    "tests/serv-logs.txt",

    `${
      TEST_PREC_FIRST_REQ ? "\n" : ""
    }Time: ${new Date().toLocaleString()}. Render duration: ${
      Date.now() - reqReceived
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

export {};
