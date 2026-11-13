import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const rawApiKey = process.env.GEMINI_API_KEY;
const apiKey = rawApiKey && !rawApiKey.startsWith('MY_') && rawApiKey.length > 10 ? rawApiKey : null;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Customer Support Endpoint
// AI Customer Support Endpoint - Supporting All Indian Languages & Merchant Payment Gateways
app.post('/api/gemini/support', async (req, res) => {
  try {
    const { messages, userContext, selectedLanguage } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const langDirective = selectedLanguage && selectedLanguage !== 'auto'
      ? `The user's preferred language code is "${selectedLanguage}". YOU MUST RESPOND IN THIS LANGUAGE (${selectedLanguage}) using its natural native script or natural transliteration, matching the user's dialect and tone.`
      : `Detect the user's input language automatically. You MUST respond in the EXACT same Indian language that the user is writing or speaking in. You are fluent in all 22 official Indian languages: Hindi (हिन्दी), Bengali (বাংলা), Telugu (తెలుగు), Marathi (मराठी), Tamil (தமிழ்), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼ିଆ), Assamese (অসমীয়া), Urdu (اردو), Bhojpuri (भोजपुरी), Maithili, etc., as well as Indian English and regional Hinglish/Tanglish/Banglish.`;

    const systemInstruction = `You are "Sahayak AI" (सहायक AI), the 24/7 dedicated Indian Fintech & Banking Customer Support Specialist for "PayMitra" (India's leading retail banking, AEPS, BBPS, recharge, financial services, and Merchant Payment Gateway platform).
The user interacting with you could be a Retail Agent (dukandar/merchant), a Distributor, or a customer.

LANGUAGE CAPABILITY:
${langDirective}

Your Comprehensive Knowledge Base:
1. Payment Gateway & Merchant Services (PhonePe, Paytm, Google Pay, BharatPe, Razorpay):
   - Merchant Standee QR & All-in-One UPI: Works with PhonePe, Paytm, Google Pay, BHIM, Cred. 0% MDR on UPI P2M payments.
   - Audio Soundbox (ध्वनि बॉक्स): Real-time voice confirmation of customer payments in Hindi, English, Bengali, Tamil, Telugu, Marathi, Gujarati, etc. Powered by 4G SIM.
   - Merchant Settlements:
     * Instant T+0 Settlement: Transfer unsettled UPI QR funds to verified merchant bank account (SBI, HDFC, ICICI, PNB) in 10 seconds.
     * T+1 Auto-Sweep: Free daily automatic transfer to merchant bank account at 7:00 AM every morning.
   - POS & Micro-ATM: Support for Chip cards, Swipe, and Contactless NFC tap for RuPay, Visa, MasterCard.
   - Payment Links: Generate WhatsApp and SMS payment links with custom amount & invoice reference.

2. AEPS (Aadhaar Enabled Payment System):
   - Biometric Mismatch: Guide user to clean scanner lens, ensure RD service driver is active, retry with index finger or thumb.
   - Transaction Failed but Amount Debited: NPCI guarantee: auto-reversal to customer's bank account within 3 to 5 working days (T+5 days). Retailer receives instant failure notification with RRN.
   - Cash Withdrawal Limit: Max ₹10,000 per transaction; up to ₹50,000/day depending on issuer bank limit.

3. Mobile & DTH Recharge:
   - Pending Recharge: Operator acknowledgment usually takes 2-15 minutes. If failed, 100% amount refunds to PayMitra wallet immediately.
   - Popular 5G Unlimited plans: Jio ₹299 (28 days 1.5GB/day), Airtel ₹349 (28 days 2GB/day), Vi ₹319, Tata Play ₹200.

4. BBPS Bill Payments & Fastag:
   - Electricity / Gas / Water / Fastag: Official BBPS reference generated instantly; biller system sync takes 24-48 hours.

5. DMT (Domestic Money Transfer):
   - Instant IMPS (24x7x365) and NEFT. Immediate bank UTR reference.

6. Financial Products (Loans & Credit Cards):
   - Shopkeeper MSME Vyapar Loan: Up to ₹10 Lakhs without collateral, daily/weekly easy repayment.
   - Personal Loan: ₹10,000 to ₹5,00,000 instant paperless disbursal.
   - Retailer Commission: 1.5% to 2.5% on loan disbursals, ₹1,200 to ₹2,500 on approved credit cards.

7. Multi-Tier Channel (Retailer, Distributor, Master Distributor):
   - Commission sharing is split 4 ways automatically on every transaction.
   - Quotas and Micro-ATM allocations are managed by parent Master Distributors.

8. Priority Support Ticket:
   - If an issue is unresolved or involves failed debits/refunds, offer to generate a Priority Support Ticket and provide a simulated Ticket ID (e.g. TKT-PG-XXXX, TKT-AEPS-XXXX).

Rules:
- Keep answers courteous, concise, professional, and actionable with clear step-by-step guidance.
- Retailer Context: ${JSON.stringify(userContext || {})}`;

    if (ai) {
      try {
        const conversationHistory = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));

        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationHistory,
          config: {
            systemInstruction,
          },
        });

        const timeoutCall = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 4500)
        );

        const response: any = await Promise.race([geminiCall, timeoutCall]);
        const replyText = response.text || 'नमस्ते! मैं आपकी किस प्रकार सहायता कर सकता हूँ?';
        return res.json({ reply: replyText });
      } catch (geminiErr) {
        console.warn('Gemini call error, falling back to local multi-lingual fintech expert:', geminiErr);
      }
    }

    // Fallback intelligent agent responses tailored to selected Indian language
    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const lang = selectedLanguage || 'hi';

    let reply = '';
    if (lang === 'bn') {
      reply = 'নমস্কার! আমি PayMitra সহকারী AI। PhonePe ও Paytm মার্চেন্ট কিউআর, সাউন্ডবক্স, AEPS, রিচার্জ ও লোন সংক্রান্ত যে কোনো সহায়তায় আমি আপনাকে সাহায্য করতে পারি।';
      if (lastUserMsg.includes('phonepe') || lastUserMsg.includes('paytm') || lastUserMsg.includes('merchant') || lastUserMsg.includes('qr') || lastUserMsg.includes('soundbox')) {
        reply = `**মার্চেন্ট পেমেন্ট গেটওয়ে সহায়তা:**\n\n1. **PhonePe ও Paytm কিউআর:** আপনার দোকানে অল-ইন-ওয়ান ইউপিআই কিউআর কোড অ্যাক্টিভ রয়েছে। গ্রাহক PhonePe, Paytm, Google Pay দিয়ে স্ক্যান করে ০% ফিতে পেমেন্ট করতে পারবেন।\n2. **সাউন্ডবক্স ভয়েস নোটিফিকেশন:** টাকা আসার সাথে সাথেই বাংলায় ভয়েস ঘোষণা হবে ("PhonePe-তে ₹500 প্রাপ্ত হয়েছে")।\n3. **ইনস্ট্যান্ট সেটেলমেন্ট (T+0):** মার্চেন্ট ওয়ালেটের টাকা সাথে সাথে আপনার ব্যাংক একাউন্টে ট্রান্সফার করতে পারেন।`;
      } else if (lastUserMsg.includes('aeps') || lastUserMsg.includes('টাকা')) {
        reply = `**AEPS সমাধান:** গ্রাহকের ব্যাংক থেকে টাকা কেটে গেলে চিন্তা করবেন না। NPCI নিয়ম অনুযায়ী T+3 কার্যদিবসের মধ্যে টাকা গ্রাহকের একাউন্টে ফেরত চলে আসবে।`;
      }
    } else if (lang === 'te') {
      reply = 'నమస్కారం! నేను PayMitra సహాయక్ AI. PhonePe & Paytm మర్చంట్ QR, సౌండ్‌బాక్స్, AEPS, రీఛార్జ్ మరియు బ్యాంకింగ్ సేవల కోసం మీకు సహాయం చేయగలను.';
      if (lastUserMsg.includes('phonepe') || lastUserMsg.includes('paytm') || lastUserMsg.includes('merchant') || lastUserMsg.includes('qr') || lastUserMsg.includes('soundbox')) {
        reply = `**మర్చంట్ పేమెంట్ గేట్‌వే వివరాలు:**\n\n1. **PhonePe & Paytm QR:** మీ షాప్ కోసం ఆల్-ఇన్-వన్ UPI QR యాక్టివ్ చేయబడింది. కస్టమర్‌లు PhonePe, GPay, Paytm ద్వారా 0% ఛార్జీలతో పేమెంట్ చేయవచ్చు.\n2. **సౌండ్‌బాక్స్ అలర్ట్స్:** పేమెంట్ రాగానే తెలుగులో స్పష్టమైన వాయిస్ అలర్ట్ వస్తుంది.\n3. **T+0 ఇన్‌స్టంట్ సెటిల్మెంట్:** మీ మర్చంట్ కలెక్షన్స్ వెంటనే మీ బ్యాంక్ ఖాతాకు సెటిల్ చేసుకోవచ్చు.`;
      }
    } else if (lang === 'ta') {
      reply = 'வணக்கம்! நான் PayMitra சகாயக் AI. போன்பே, பேடிஎம் வணிகர் QR, சவுண்ட்பாக்ஸ், AEPS மற்றும் ரீசார்ஜ் சேவைகளில் உங்களுக்கு உதவ தயாராக உள்ளேன்.';
      if (lastUserMsg.includes('phonepe') || lastUserMsg.includes('paytm') || lastUserMsg.includes('merchant') || lastUserMsg.includes('qr')) {
        reply = `**வணிகர் பேமெண்ட் கேட்வே:**\n\n1. **PhonePe & Paytm QR:** உங்கள் கடைக்கான ஆல்-இன்-ஒன் QR 0% கட்டணத்தில் இயங்குகிறது.\n2. **சவுண்ட்பாக்ஸ்:** பணம் பெறப்பட்டதும் தமிழில் குரல் அறிவிப்பு வரும்.\n3. **உடனடி செட்டில்மென்ட் (T+0):** உங்கள் சேகரிக்கப்பட்ட தொகையை உடனடியாக வங்கி கணக்கிற்கு மாற்றலாம்.`;
      }
    } else if (lang === 'mr') {
      reply = 'नमस्कार! मी PayMitra सहाय्यक AI आहे. PhonePe, Paytm मर्चंट QR, साउंडबॉक्स, AEPS आणि कर्जासंबंधी सर्व प्रश्नांसाठी मी उपलब्ध आहे.';
      if (lastUserMsg.includes('phonepe') || lastUserMsg.includes('paytm') || lastUserMsg.includes('merchant') || lastUserMsg.includes('qr')) {
        reply = `**मर्चंट पेमेंट गेटवे माहिती:**\n\n1. **PhonePe & Paytm QR:** आपल्या दुकानासाठी ऑल-इन-वन UPI QR उपलब्ध आहे ज्यावर 0% शुल्क आहे.\n2. **साउंडबॉक्स व्हॉईस:** पैसे आल्यावर मराठीत त्वरित आवाज येतो.\n3. **इन्स्टंट सेटलमेंट (T+0):** मिळालेले पैसे थेट तुमच्या बँक खात्यात त्वरित वर्ग करा.`;
      }
    } else if (lang === 'en') {
      reply = 'Hello! I am PayMitra Sahayak AI. How may I assist you with PhonePe/Paytm Merchant QR, Soundbox, AEPS, BBPS, or financial services today?';
      if (lastUserMsg.includes('phonepe') || lastUserMsg.includes('paytm') || lastUserMsg.includes('merchant') || lastUserMsg.includes('gateway') || lastUserMsg.includes('soundbox') || lastUserMsg.includes('settlement')) {
        reply = `**Payment Gateway & Merchant Solutions:**\n\n1. **PhonePe & Paytm Smart QR:** Accept UPI payments from all apps (PhonePe, Paytm, Google Pay, Cred, BHIM) at 0% MDR.\n2. **Audio Soundbox:** Real-time loud voice notifications for incoming customer payments in all major Indian languages.\n3. **Instant T+0 Bank Settlement:** Settle merchant collections into your registered bank account (SBI/HDFC/ICICI) within 10 seconds, or use free automatic T+1 morning auto-sweep.\n4. **POS & Micro-ATM:** Accept RuPay, Visa, MasterCard tap and chip payments directly from your shop.`;
      } else if (lastUserMsg.includes('aeps') || lastUserMsg.includes('aadhaar')) {
        reply = `**AEPS Troubleshooting:**\n\n1. **Biometric Mismatch:** Clean the fingerprint scanner glass, check the RD service app status, and retry with the thumb or index finger.\n2. **Amount Debited but Failed:** NPCI rules guarantee auto-reversal to the customer's bank account within 3 to 5 working days (T+5 days).\n3. **RRN Reference:** Always provide the customer with the 12-digit RRN number for their records.`;
      }
    } else {
      // Default Hindi / Hinglish
      reply = 'नमस्ते! मैं PayMitra सहायक AI हूँ। मैं आपकी PhonePe, Paytm मर्चेंट QR, साउंडबॉक्स, AEPS, रिचार्ज, बिल पेमेंट और लोन संबंधी सहायता के लिए 24/7 उपलब्ध हूँ।';
      if (lastUserMsg.includes('phonepe') || lastUserMsg.includes('paytm') || lastUserMsg.includes('merchant') || lastUserMsg.includes('मर्चेंट') || lastUserMsg.includes('soundbox') || lastUserMsg.includes('साउंडबॉक्स') || lastUserMsg.includes('qr') || lastUserMsg.includes('settlement') || lastUserMsg.includes('सेटलमेंट')) {
        reply = `**PhonePe और Paytm मर्चेंट गेटवे सहायता:**\n\n1. **ऑल-इन-वन मर्चेंट QR:** दुकान पर PhonePe, Paytm, Google Pay, BHIM और Cred से पेमेंट स्वीकार करें। भारत सरकार के नियमानुसार UPI P2M पर 0% MDR (शून्य चार्ज) है।\n2. **स्मार्ट 4G साउंडबॉक्स (ध्वनि बॉक्स):** पेमेंट आते ही तेज और स्पष्ट आवाज में पुष्टि: "PhonePe पर ₹500 प्राप्त हुए!" यह हिंदी, अंग्रेजी, बंगाली, तमिल, तेलुगु, मराठी सहित सभी भारतीय भाषाओं में काम करता है।\n3. **इंस्टेंट T+0 बैंक सेटलमेंट:** इकट्ठा हुआ मर्चेंट बैलेंस 10 सेकंड में आपके बैंक खाते में क्रेडिट हो जाता है। सुबह 7:00 बजे का T+1 ऑटो-स्वीप बिल्कुल मुफ्त है।\n4. **POS कार्ड स्वाइप:** क्रेडिट व डेबिट कार्ड (RuPay, Visa, MasterCard) से पेमेंट स्वीकारें।`;
      } else if (lastUserMsg.includes('aeps') || lastUserMsg.includes('आधार') || lastUserMsg.includes('biometric')) {
        reply = `**AEPS संबंधित सहायता:**\n\n1. **बायोमेट्रिक एरर (Biometric Mismatch):** कृपया फिंगरप्रिंट स्कैनर साफ करें और कस्टमर की दूसरी अंगुली से प्रयास करें।\n2. **खाते से पैसे कटे पर रिटेलर को नहीं मिले:** चिंता न करें, NPCI और RBI के नियमानुसार यह राशि 48 से 72 घंटों (T+3 Working Days) के भीतर ग्राहक के बैंक खाते में स्वतः वापस आ जाती है।\n3. **रेफरेंस नंबर:** कृपया ग्राहक को 12-अंकों का RRN नंबर अवश्य दें।`;
      } else if (lastUserMsg.includes('recharge') || lastUserMsg.includes('रिचार्ज') || lastUserMsg.includes('pending')) {
        reply = `**रिचार्ज स्टेटस और समाधान:**\n\n- यदि रिचार्ज 'Pending' दिखा रहा है, तो ऑपरेटर साइड से 5-10 मिनट में कन्फर्मेशन आ जाता है।\n- यदि रिचार्ज 'Failed' होता है, तो पूरा अमाउंट तुरंत आपके PayMitra मेन वॉलेट में क्रेडिट हो जाता है।`;
      } else if (lastUserMsg.includes('loan') || lastUserMsg.includes('लोन')) {
        reply = `**फाइनेंशियल प्रोडक्ट्स (लोन और क्रेडिट कार्ड):**\n\n- **दुकानदार बिज़नेस लोन:** बिना किसी गारंटी के तुरंत ₹10 लाख तक का MSME लोन।\n- **पर्सनल लोन:** ₹5,000 से ₹5,00,000 तक 100% पेपरलेस प्रोसेस।\n- **रिटेलर कमीशन:** प्रति स्वीकृत लोन फाइल पर 1.5% से 2.5% तक का तत्काल कमीशन!`;
      } else if (lastUserMsg.includes('ticket') || lastUserMsg.includes('शिकायत')) {
        const ticketId = 'TKT-PG-' + Math.floor(100000 + Math.random() * 900000);
        reply = `आपकी शिकायत दर्ज कर ली गई है!\n\n📌 **टिकट संख्या:** \`${ticketId}\`\n⏱️ **समाधान समय:** 2 से 4 घंटे\nहमारी टेक्निकल टीम आपके रजिस्टर्ड मोबाइल पर अपडेट भेजेगी।`;
      }
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini Support API Error:', error);
    return res.status(500).json({
      error: 'Failed to generate AI response',
      details: error?.message || 'Internal server error',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PayMitra API Server', timestamp: new Date().toISOString() });
});

// Dev vs Prod Vite handling
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`PayMitra Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
