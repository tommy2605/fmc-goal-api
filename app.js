require("dotenv").config();
const express = require("express");
const goals = require("./goals");
const database = require("./database");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const mammoth = require('mammoth');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/privacy_policy", express.static("./static/privacy_policy"));

// bootstrap
(async () => {
  await database.setup();
  console.log("Database is ready!");
  app.listen(process.env.PORT, () =>
    console.log(`Server is ready at port ${process.env.PORT}!`)
  );

  // migrate to cosmos db
  /*
    const items = await goals.find({})
    items.forEach(database.createItem)
    */
})();

app.get("/api/goals/", async (req, res) => {
  console.log("GET /api/goals/");
  try {
    const result = await database.queryAll();
    res.json(
      result.sort((a, b) => parseInt(b.publishDate) - parseInt(a.publishDate))
    );
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/api/goals", async (req, res) => {
  console.log("POST /api/goals");
  try {
    const item = req.body;
    validate(item);
    await database.createItem(item);
    res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
    console.log(err);
  }
});

const validate = (item) => {
  if (!item) throw `Missing data`;
  if (!item.title) throw `Missing title`;
  if (!item.culture) throw "Missing culture";
  if (!["en", "nl", "id"].includes(item.culture)) throw `Bad culture`;
  if (!item.publishDate) throw `Missing publishDate`;
  if (!item.content) throw `Missing content`;
  try {
    const date = new Date(item.publishDate);
    if (date.getDay() !== 0) throw `Bad publishDate`;
    const publishDate = date.formal();
    item.publishDate = publishDate;
    item.publishDateInCulture = goals.publishDateInCulture(
      `${publishDate}_${item.culture}`
    );
  } catch {
    throw `Bad publishDate`;
  }
};

Number.prototype.formal = function (length) {
  let result = this.toString();
  while (result.length < length) {
    result = `0${result}`;
  }
  return result;
};

Date.prototype.formalDate = function () {
  return this.getDate().formal(2);
};

Date.prototype.formalMonth = function () {
  return (this.getMonth() + 1).formal(2);
};

Date.prototype.formal = function () {
  return `${this.getFullYear()}${this.formalMonth()}${this.formalDate()}`;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./temp"); //here we specify the destination. in this case i specified the current directory
  },
  filename: function (req, file, cb) {
    req.uploadedFile = path.join('./temp', file.originalname)
    cb(null, file.originalname); 
  },
});

const uploadDisk = multer({ storage })

app.post("/api/goals/convert", uploadDisk.single("docx"), async (req, res) => {
    try {
        const result = await mammoth.convertToHtml({path: req.uploadedFile})
        if (result.messages && result.messages.length > 0) {
            console.error(result.messages)
            res.status(404).send("Bad document")
            return
        } 
        res.json(postProcessGoal(result.value, req.uploadedFile))    
    } catch (err) {
        console.error(err)
        res.status(500).send('Ooh la la..')
    }
});

const postProcessGoal = (html, fileName) => {
    const parseTitle = html.match(/<p><strong>([A-Z\s]+)<\/strong><\/p>/)
    const parseDate = html.match(/<p>Goal\.(\d{2}).(\d{2}).(\d{4})<\/p>/)
    const parseCulture = fileName.match(/_([A-Z]{2}).docx/)

    if (!parseTitle) throw "Bad document title"
    if (!parseDate) throw "Bad document date"
    if (!parseCulture) throw "Bad document culture"

    const title = parseTitle[1]
    const publishDate = `${parseDate[3]}${parseDate[2]}${parseDate[1]}`
    const content = html
        .replace(parseTitle[0], '')
        .replace(parseDate[0], '')
        .replace( // make H1
            /<p><strong>([A-Z\s]+)<\/strong><\/p>/g, 
            (_, header) => `<h1>${header.trim()}</h1>`    
        )
        .replace(/[\n\r]/g, '')
        .trim()

    const culture = parseCulture[1].toLowerCase()

    return {
        publishDate,
        culture,
        publishDateInCulture: goals.publishDateInCulture(`${publishDate}_${culture.toUpperCase()}`),
        title,
        content
    }
}

 
