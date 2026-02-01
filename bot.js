import { Telegraf, Markup } from 'telegraf';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express'; 
import cors from 'cors';       

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bot = new Telegraf(process.env.BOT_TOKEN);
const WEB_APP_URL = process.env.WEBAPP_URL;

// --- API VA SERVER QISMI ---
const app = express();
app.use(cors()); 

// 1. Build qilingan React fayllarini ulash
// Vite odatda 'dist' papkasiga build qiladi
const buildPath = path.join(__dirname, 'dist');
app.use(express.static(buildPath));

// 2. Foydalanuvchini qidirish API (React uchun)
app.get('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  const cleanUsername = username.replace('@', '');

  try {
    const chat = await bot.telegram.getChat(`@${cleanUsername}`);
    
    let avatar = 'https://via.placeholder.com/150'; 
    if (chat.photo) {
      const photoLink = await bot.telegram.getFileLink(chat.photo.big_file_id);
      avatar = photoLink.href;
    }

    res.json({
      id: chat.id,
      username: chat.username,
      first_name: chat.first_name,
      avatar: avatar
    });
  } catch (error) {
    console.error("Qidiruvda xato:", error.message);
    res.status(404).json({ error: 'User not found' });
  }
});

// 3. Barcha boshqa so'rovlarga index.html ni qaytarish
// Bu "Cannot GET /" xatosini yo'qotadi va React ishlashini ta'minlaydi
// Express 5+ versiyasi uchun yulduzcha (*) regex ko'rinishida yoziladi
app.get('/:any*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda va Web App ishga tushdi`));

// --- BOT LOGIKASI ---
bot.telegram.setMyCommands([
  { command: 'start', description: 'Botni ishga tushirish' },
  { command: 'referral', description: 'Referral program' },
  { command: 'help', description: 'Yordam' }
]);

bot.start((ctx) => {
  const imagePath = path.join(__dirname, 'img', 'IMG_5085.PNG'); 
  const welcomeMessage = `⭐ <b>Tez Starʼga xush kelibsiz!</b> 👏\n\nViza kartasiz o'zingiz yoki do'stlaringiz uchun Telegram Premium va ⭐ olishingiz mumkin.`;

  ctx.replyWithPhoto(
    { source: imagePath }, 
    {
      caption: welcomeMessage,
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.webApp('Ilovani ochish 🚀', WEB_APP_URL)],
        [Markup.button.url('Kanalimizga a’zo bo‘ling', 'https://t.me/tezstar')]
      ])
    }
  ).catch(() => ctx.reply(welcomeMessage, { parse_mode: 'HTML' }));
});

// Referral va Help komandalari o'z joyida qoladi...
bot.command('referral', (ctx) => { /* ... avvalgi kodingiz ... */ });
bot.help((ctx) => { /* ... avvalgi kodingiz ... */ });

bot.launch().then(() => console.log('Bot muvaffaqiyatli ishga tushdi!'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));