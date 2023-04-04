const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;
const { Expo } = require("expo-server-sdk");
const { registToken, getToken } = require("./helpers/token");
const expo = new Expo();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => res.send("Connect"));

app.post("/regist-token", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token is required !" });
    const regist = await registToken(token);
    res.status(200).json(regist);
  } catch (err) {
    res.status(400).json({ message: err?.message || "Failed regist token !" });
  }
});

app.get("/token", async (_, res) => {
  try {
    const data = await getToken();
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: err?.message });
  }
});

app.post("/notif", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: `'title' and 'content' is required !` });
    }
    const token = await getToken();
    if (!Expo.isExpoPushToken(token)) {
      return res.status(400).json({ message: `Invalid token !` });
    }

    const chunks = expo.chunkPushNotifications([
      {
        to: token,
        body: content,
        title,
      },
    ]);

    const tickets = await expo.sendPushNotificationsAsync(chunks[0]);

    res.status(200).json({ data: tickets });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: err?.message || "Failed send notification !" });
  }
});

app.listen(port, () => {
  console.log(`Connected on PORT ${port}`);
});
