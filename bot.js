import { Telegraf, Markup } from 'telegraf';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express'; 
import cors from 'cors';       

dotenv.config();

import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bot = new Telegraf(process.env.BOT_TOKEN);
const WEB_APP_URL = process.env.WEBAPP_URL;

// --- API VA SERVER QISMI ---
const app = express();
app.use(cors({
    origin: '*', // Barcha manzil va IP-lardan so'rov qabul qiladi
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
}));
const buildPath = path.join(__dirname, 'dist');
app.use(express.static(buildPath));

let orderCounter = 1;

app.use(express.json()); // JSON formatini o'qish uchun shart!


// 1. Foydalanuvchini qidirish API
app.get('/api/user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        // Username-ni tozalab, @ belgisini qo'shamiz
        const cleanUsername = `@${username.replace(/^@+/, '')}`;
        
        console.log(`Qidirilmoqda: ${cleanUsername}`);

        // Telegramdan chat ma'lumotlarini olish
        const chat = await bot.telegram.getChat(cleanUsername);
        
        // Profil rasmini olish
        let avatar = 'https://via.placeholder.com/150'; // Default rasm
        if (chat.photo && chat.photo.big_file_id) {
            const fileLink = await bot.telegram.getFileLink(chat.photo.big_file_id);
            avatar = fileLink.href;
        }

        // Web App-ga ma'lumotni qaytarish
        res.json({
            id: chat.id,
            first_name: chat.first_name || chat.title || "Telegram User",
            username: chat.username,
            avatar: avatar
        });

    } catch (error) {
        console.error("Telegram Search Error:", error.message);
        res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }
});

// Kodning tepasida bular borligiga ishonch hosil qiling:
// const { Markup } = require('telegraf'); 
// const WEB_APP_URL = process.env.WEB_APP_URL || 'sizning_web_app_manzilingiz';

app.post('/api/create-order', async (req, res) => {
    // userId bu yerda foydalanuvchining Telegram ID-si bo'lishi kerak
    const { recipient, stars, price, paymentMethod, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "Foydalanuvchi ID-si (userId) yuborilmadi" });
    }

    const orderId = orderCounter++;
    const methodEmoji = paymentMethod.toLowerCase() === 'click' ? '💳 Click' : '🔹 Payme';

    const message = 
        `🎉 <b>Buyurtma yaratildi!</b>\n\n` +
        `<b>ID:</b> #${orderId}\n` +
        `<b>To'lov:</b> ${methodEmoji}\n` +
        `<b>Qabul qiluvchi:</b> ${recipient.username}\n` +
        `⭐ <b>${stars} Stars | ${price}</b>\n\n` +
        `<i>To'lovni amalga oshirish yoki buyurtmani ko'rish uchun pastdagi tugmani bosing. 👇</i>`;

    try {
        // Telegram Bot orqali foydalanuvchiga xabar yuborish
        await bot.telegram.sendMessage(userId, message, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [Markup.button.webApp('💳 To\'lov qilish / Ko\'rish', WEB_APP_URL)]
            ])
        });

        console.log(`Buyurtma #${orderId} uchun @${userId} ga xabar yuborildi.`);
        res.status(200).json({ success: true, orderId });

    } catch (error) {
        console.error("Telegram xabar yuborishda xato:", error.message);
        
        // Agar foydalanuvchi botni bloklagan bo'lsa yoki hali start bosmagan bo'lsa
        res.status(500).json({ 
            error: "Bot foydalanuvchiga xabar yubora olmadi. Botni bloklamaganingizga ishonch hosil qiling." 
        });
    }
});

// 2. React ilovasi uchun Catch-all (Express 5 mos)
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

async function buyStarsOnFragment(recipientUsername, starAmount) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // 1. Fragment Stars sahifasiga o'tish
        await page.goto('https://fragment.com/stars');

        // 2. Qabul qiluvchi usernameni yozish
        await page.type('input[placeholder="Enter username"]', recipientUsername);
        await page.click('.btn-primary'); // Qidirish

        // 3. Star miqdorini tanlash

        // Bu yerda starAmount ga qarab kerakli paketni tanlash logikasi bo'ladi
        
        // 4. TON hamyonini ulash va to'lovni tasdiqlash
        // DIQQAT: Bu qism eng murakkab qismi, chunki TON hamyonidan 
        // tranzaksiyani avtomatik imzolash (signing) kerak bo'ladi.
        
        return { success: true };
    } catch (error) {
        console.error("Fragment xatosi:", error);
        return { success: false };
    } finally {
        await browser.close();
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda va Web App ishga tushdi`));

// --- BOT LOGIKASI ---
bot.telegram.setMyCommands([
  { command: 'start', description: 'Botni ishga tushirish' },
  { command: 'referral', description: 'Referral program' },
  { command: 'help', description: 'Yordam' }
]);

// START komandasi
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
        [Markup.button.url('Kanalimizga a’zo bo‘ling', 'https://t.me/ymastars')]
      ])
    }
  ).catch(() => ctx.reply(welcomeMessage, { parse_mode: 'HTML' }));
});

// REFERRAL komandasi
bot.command('referral', (ctx) => {
  const userId = ctx.from.id;
  // Dinamik havola yaratish (Faqat sizning ID emas, har bir user uchun)
  const referralLink = `https://t.me/tezstar_bot/app?startapp=${userId}`;

  const referralMessage = 
    `🔗 <b>Do'stlaringizni taklif qilib Stars ishlang</b>\n\n` +
    `Do'stlaringiz ⭐️ Tez Star orqali xarid qilsa — sizga avtomatik bonus Stars tushadi.\n` +
    `Oddiy va qulay daromad usuli ✨\n\n` +
    `👇 <b>Bonuslar:</b>\n` +
    `• Premium sotib olsa — +15 ⭐️\n` +
    `• 1000 Stars sotib olsa — +50 ⭐️\n` +
    `• 500 Stars sotib olsa — +25 ⭐️\n` +
    `• 100 Stars sotib olsa — +5 ⭐️\n\n` +
    `❤️ <b>Sizning havolangiz:</b>\n${referralLink}\n\n` +
    `⭐️ <b>Do'stlar:</b> 0 | <b>Ishlangan:</b> 0 Stars\n\n` +
    `<a href="https://t.me/ymastars">Batafsil ma'lumot</a>`;

  ctx.replyWithHTML(referralMessage, {
    disable_web_page_preview: true,
    ...Markup.inlineKeyboard([
      [Markup.button.url('🚀 Ulashish', `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("⭐ Tez Star orqali Telegram Stars va Premium sotib oling!")}`)]
    ])
  });
});

// HELP komandasi
bot.help((ctx) => {
  const helpMessage = 
    `⭐️ <b>Tez Star - Yordam</b>\n\n` +
    `👇 <b>Mavjud buyruqlar:</b>\n\n` +
    `/start - Botni ishga tushirish\n` +
    `/referral - Do'stlar dasturi va referral havola\n` +
    `/help - Ushbu yordam xabari\n\n` +
    `💡 <b>Xizmatlar:</b>\n` +
    `• Telegram Stars - O'yinlar, sticker, hadyalar uchun\n` +
    `• Telegram Premium - O'zingiz yoki do'stlaringiz uchun\n\n` +
    `🔒 <b>To'lov usullari:</b>\n` +
    `• Click\n` +
    `• Payme\n\n` +
    `✉️ <b>Qo'llab-quvvatlash:</b> @yusufbe_fx\n\n` +
    `✈️ <b>Yangiliklar kanali:</b> @ymastars`;

  ctx.replyWithHTML(helpMessage);
});

bot.launch().then(() => console.log('Bot muvaffaqiyatli ishga tushdi!'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));