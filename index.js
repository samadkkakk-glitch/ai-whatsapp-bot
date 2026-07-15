import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import P from "pino";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const jid = msg.key.remoteJid;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (text.toLowerCase() === "hi") {
      await sock.sendMessage(jid, {
        text: "👋 Assalamu Alaikum!"
      });
    }

    if (text.toLowerCase() === "ping") {
      await sock.sendMessage(jid, {
        text: "🏓 Pong!"
      });
    }

    if (text.toLowerCase() === "owner") {
      await sock.sendMessage(jid, {
        text: "Owner: Samad"
      });
    }

    if (text.toLowerCase() === "menu") {
      await sock.sendMessage(jid, {
        text: `📋 *Menu*

Hi
Ping
Owner
Menu`
      });
    }
  });

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      startBot();
    }

    if (connection === "open") {
      console.log("✅ Bot Connected");
    }
  });
}

startBot();
