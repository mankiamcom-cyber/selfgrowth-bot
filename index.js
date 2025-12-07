import { Client, Databases } from "node-appwrite";

export default async ({ req, res, log }) => {
  try {
    log("🚀 SelfGrowthBot started...");

    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const db = new Databases(client);

    const body = JSON.parse(req.body || "{}");

    const userId = body.userId || "guest_user";
    const message = body.message || "";
    const language = body.language || "fa";

    log(`👤 User: ${userId}`);
    log(`💬 Message: ${message}`);

    let botReply = "";

    if (language === "fa") {
      if (message.includes("انگیزه")) {
        botReply = "تو قوی‌تر از چیزی هستی که فکر می‌کنی. فقط ادامه بده 🌱";
      } else if (message.includes("افسرده")) {
        botReply = "احساساتت ارزشمندن. من کنارتم. آروم نفس بکش 🤍";
      } else {
        botReply = "من اینجام تا کمکت کنم رشد کنی. بیشتر توضیح بده چی درونته؟";
      }
    } else {
      if (message.toLowerCase().includes("motivation")) {
        botReply = "You are stronger than you think. Keep going 🌱";
      } else if (message.toLowerCase().includes("sad")) {
        botReply = "Your feelings matter. I'm here with you 🤍";
      } else {
        botReply = "I'm here to help you grow. Tell me more.";
      }
    }

    log(`🤖 Bot Reply: ${botReply}`);

    await db.createDocument("selfgrowth_db", "chats", "unique()", {
      userId,
      message,
      role: "user",
      createdAt: new Date().toISOString()
    });

    await db.createDocument("selfgrowth_db", "chats", "unique()", {
      userId,
      message: botReply,
      role: "bot",
      createdAt: new Date().toISOString()
    });

    return res.json({ success: true, reply: botReply });

  } catch (err) {
    log("❌ Error: " + err.message);
    return res.json({ success: false, error: err.message });
  }
};
