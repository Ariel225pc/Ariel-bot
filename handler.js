import { runCommand, commandList } from './commands/core.js';
import { saveConfig } from './lib/config.js';
const groupState = new Map();
const getText = m => m.message?.conversation || m.message?.extendedTextMessage?.text || m.message?.imageMessage?.caption || m.message?.videoMessage?.caption || '';
const jidNumber = jid => (jid || '').split('@')[0].split(':')[0];

export async function handleMessage(sock, msg, config) {
  if (!msg.message || msg.key.fromMe) return;
  const jid = msg.key.remoteJid;
  if (!jid || jid === 'status@broadcast') return;
  const sender = msg.key.participant || jid;
  const isOwner = !!config.ownerNumber && jidNumber(sender) === config.ownerNumber;
  const text = getText(msg).trim();
  if (!text) return;

  if (jid.endsWith('@g.us') && config.antiLink && /(https?:\/\/|www\.|chat\.whatsapp\.com\/)/i.test(text)) {
    try {
      const meta = await sock.groupMetadata(jid);
      const author = meta.participants.find(p => p.id === sender);
      const bot = meta.participants.find(p => jidNumber(p.id) === jidNumber(sock.user.id));
      if (!author?.admin && bot?.admin) {
        await sock.sendMessage(jid, { delete: msg.key });
        await sock.sendMessage(jid, { text: '🚫 Lien supprimé : seuls les liens autorisés sont acceptés.' });
      }
    } catch (e) { console.error('Antilink:', e.message); }
  }

  if (!text.startsWith(config.prefix)) return;
  if (config.mode === 'private' && !isOwner && !msg.key.fromMe) return;
  const body = text.slice(config.prefix.length).trim();
  if (!body) return;
  const [raw, ...args] = body.split(/\s+/);
  const command = raw.toLowerCase();
  const reply = t => sock.sendMessage(jid, { text: t }, { quoted: msg });
  const isGroup = jid.endsWith('@g.us');
  let isAdmin = false;
  if (isGroup) {
    try {
      const meta = await sock.groupMetadata(jid);
      isAdmin = !!meta.participants.find(p => p.id === sender)?.admin;
    } catch {}
  }
  await runCommand({ sock, msg, jid, sender, args, command, config, isOwner, isGroup, isAdmin, reply, groupState, saveConfig: () => saveConfig(config), commandList });
}
