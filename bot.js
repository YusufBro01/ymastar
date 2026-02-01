import { Telegraf, Markup } from 'telegraf';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express'; // Yangi qo'shildi
import cors from 'cors';       // Yangi qo'shildi

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bot = new Telegraf(process.env.BOT_TOKEN);
const WEB_APP_URL = process.env.WEBAPP_URL;

// --- API SERVER QISMI (React uchun) ---
const app = express();
app.use(cors()); // Frontend'dan so'rovlarga ruxsat berish

// React'dagi findUserByUsername funksiyasi shu yerga murojaat qiladi
app.get('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  const cleanUsername = username.replace('@', '');

  try {
    // Telegram'dan foydalanuvchi ma'lumotlarini olish
    const chat = await bot.telegram.getChat(`@${cleanUsername}`);
    
    let avatar = 'https://via.placeholder.com/150'; // Default rasm
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API server portda ishlayapti: ${PORT}`));

// --- BOT LOGIKASI (Sizning kodingiz) ---
bot.telegram.setMyCommands([
  { command: 'start', description: 'Botni ishga tushirish' },
  { command: 'referral', description: 'Referral program' },
  { command: 'help', description: 'Yordam' }
]);

bot.start((ctx) => {
  const imagePath = path.join(__dirname, 'img', 'IMG_5085.PNG'); 
  const welcomeMessage = `⭐ <b>Tez Starʼga xush kelibsiz!</b> 👏\n\nViza kartasiz o'zingiz yoki do'stlaringiz uchun Telegram Premium va ⭐ olishingiz mumkin.\n\n🔒 <b>Click/Payme</b> orqali tez va xavfsiz to'lov.\n\n👇 Boshlash uchun tugmani bosing.`;

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

bot.command('referral', (ctx) => {
  const userId = ctx.from.id;
  const referralLink = `https://t.me/tezstar_bot/app?startapp=${userId}`;

  const referralMessage = 
    `🔗 <b>Do'stlaringizni taklif qilib Stars ishlang</b>\n\n` +
    `Do'stlaringiz ⭐ Tez Star orqali xarid qilsa — sizga avtomatik bonus Stars tushadi.\n` +
    `Oddiy va qulay daromad usuli ✨\n\n` +
    `👇 <b>Bonuslar:</b>\n` +
    `• Premium sotib olsa — +15 ⭐\n` +
    `• 1000 Stars sotib olsa — +50 ⭐\n` +
    `• 500 Stars sotib olsa — +25 ⭐\n` +
    `• 100 Stars sotib olsa — +5 ⭐\n\n` +
    `❤️ <b>Sizning havolangiz:</b>\n${referralLink}\n\n` +
    `⭐ <b>Do'stlar:</b> 0 | <b>Ishlangan:</b> 0 Stars\n\n` +
    `<a href="https://t.me/tezstar/154">Batafsil ma'lumot</a>`;

  ctx.replyWithHTML(referralMessage, {
    disable_web_page_preview: false,
    ...Markup.inlineKeyboard([
      [Markup.button.url('🚀 Ulashish', `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("⭐ Tez Star orqali Telegram Stars va Premium sotib oling!")}`)]
    ])
  });
});

bot.help((ctx) => {
  const helpMessage = `⭐ <b>Tez Star - Yordam</b>\n\n... (matn)`;
  ctx.replyWithHTML(helpMessage, Markup.inlineKeyboard([
    [Markup.button.webApp('Boshlash (Web App)', WEB_APP_URL)]
  ]));
});

bot.launch().then(() => console.log('Bot muvaffaqiyatli ishga tushdi!'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));