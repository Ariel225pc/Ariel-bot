import 'dotenv/config';
import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import fs from 'node:fs';
import { handleMessage } from './src/handler.js';
import { loadConfig } from './src/lib/config.js';

const config = loadConfig();
let starting = false;

async function startBot() {
  if (starting) return;
  starting = true;
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  let version;
  try { ({ version } = await fetchLatestBaileysVersion()); } catch { version = undefined; }
  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['ARIELBOT', 'Chrome', '2.0.0'],
    markOnlineOnConnect: false,
    syncFullHistory: false
  });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) qrcode.generate(qr, { small: true });
    if (connection === 'open') console.log('✅ ARIELBOT connecté. Préfixe :', config.prefix);
    if (connection === 'close') {
      starting = false;
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) setTimeout(startBot, 4000);
      else console.log('Session déconnectée. Supprime la session uniquement si tu veux relier un autre compte.');
    }
  });
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try { await handleMessage(sock, msg, config); }
      catch (e) { console.error('Erreur message:', e?.message || e); }
    }
  });
  starting = false;
}

process.on('unhandledRejection', e => console.error('Erreur asynchrone:', e));
process.on('uncaughtException', e => console.error('Erreur:', e));
startBot().catch(e => { starting = false; console.error('Démarrage impossible:', e); });
