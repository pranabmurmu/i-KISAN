import { LanguageCode } from '../types';

export interface AiResponse {
  text: string;
  suggestedPrompts: string[];
}

export function generateFarmerAiResponse(query: string, lang: LanguageCode): AiResponse {
  const q = query.toLowerCase().trim();

  // English matches
  if (lang === 'en') {
    if (q.includes('rain') || q.includes('tomorrow') || q.includes('irrigation') || q.includes('water')) {
      return {
        text: '🌧️ Agro-Advisory: Heavy rainfall (72% probability) is forecast for tomorrow in your region. You should completely avoid irrigation today and postpone any fertilizer or pesticide spraying to prevent wash-off.',
        suggestedPrompts: [
          'What about fertilizer after rain?',
          'How to prevent waterlogging?',
          'Check current mandi prices',
        ],
      };
    }
    if (q.includes('fertilizer') || q.includes('urea') || q.includes('potash') || q.includes('npk')) {
      return {
        text: '🧪 Fertilizer Guide: For your Paddy crop in the grain-filling stage, avoid high nitrogen (urea). Instead, apply Muriate of Potash (MOP) @ 15 kg/acre or foliar Potash spray (1%) after rainfall stops to boost grain weight and disease resistance.',
        suggestedPrompts: [
          'How to apply Bio-NPK?',
          'Should I spray before rain?',
          'Stem borer symptoms',
        ],
      };
    }
    if (q.includes('price') || q.includes('mandi') || q.includes('rate') || q.includes('sell')) {
      return {
        text: '📈 Mandi Intelligence: Attabira APMC Mandi (28 km away) is offering the best price at ₹2,450/quintal for Grade-A Paddy. This is ₹150 higher than Jatni Mandi (₹2,300/qtl). We recommend scheduling transport to Mandi B.',
        suggestedPrompts: [
          'Show price forecast graph',
          'Which crops have highest ROI?',
          'What is MSP for Paddy?',
        ],
      };
    }
    if (q.includes('disease') || q.includes('blight') || q.includes('leaf') || q.includes('yellow') || q.includes('pest')) {
      return {
        text: '🌿 Crop Health Alert: If you observe yellowing wavy leaf edges, it is likely Bacterial Leaf Blight. Drain standing field water, withhold urea, and spray Pseudomonas fluorescens (10 g/L) or Copper Oxychloride once foliage dries.',
        suggestedPrompts: [
          'Open Crop Disease Lab Camera',
          'Organic neem oil dosage',
          'How to claim PMFBY crop loss?',
        ],
      };
    }
    if (q.includes('scheme') || q.includes('kisan') || q.includes('pm-kisan') || q.includes('subsidy') || q.includes('loan') || q.includes('officer')) {
      return {
        text: '🏛️ Farmer Support: PM-KISAN 17th installment of ₹2,000 has been credited. If your distress score exceeds 20%, our system has already notified your local Block Agriculture Extension Officer (Shri R. K. Mohapatra) for priority field visit assistance.',
        suggestedPrompts: [
          'Check officer dispatch status',
          'How to apply for solar pump?',
          'PMFBY 72-hour claim guide',
        ],
      };
    }
    return {
      text: '🌾 Smart Krishi Advisor: I have analyzed your farm profile (3 Acres Paddy in Khordha). The primary advisory today is to prepare field drainage before tomorrow’s rainfall and hold chemical inputs. How else can I assist your farm today?',
      suggestedPrompts: [
        'What should I do if it rains tomorrow?',
        'Best fertilizer for grain filling stage',
        'Check nearby mandi prices',
        'Diagnose crop disease with photo',
      ],
    };
  }

  // Hindi matches
  if (lang === 'hi') {
    if (q.includes('बारिश') || q.includes('पानी') || q.includes('सिंचाई') || q.includes('कल')) {
      return {
        text: '🌧️ कृषि सलाह: कल आपके क्षेत्र में भारी बारिश (72% संभावना) का पूर्वानुमान है। आज खेत में सिंचाई बिल्कुल न करें और खाद या कीटनाशक का छिड़काव रोक दें ताकि दवा बहने से बच सके।',
        suggestedPrompts: [
          'बारिश के बाद कौन सा उर्वरक दें?',
          'जलभराव से कैसे बचें?',
          'मंडी भाव देखें',
        ],
      };
    }
    if (q.includes('खाद') || q.includes('यूरिया') || q.includes('पोटाश') || q.includes('उर्वरक')) {
      return {
        text: '🧪 उर्वरक प्रबंधन: धान की दाना भराव अवस्था में यूरिया का प्रयोग न करें। बारिश रुकने के बाद 15 किग्रा/एकड़ पोटाश (MOP) या 1% पोटाश का पर्णीय छिड़काव करें जिससे दाना चमकदार व भारी बनेगा।',
        suggestedPrompts: [
          'जैविक खाद कैसे बनाएं?',
          'कीट रोकथाम के उपाय',
          'मंडी भाव की तुलना करें',
        ],
      };
    }
    if (q.includes('भाव') || q.includes('मंडी') || q.includes('दाम') || q.includes('दाम')) {
      return {
        text: '📈 मंडी भाव: अट्टाबीरा मंडी (28 किमी) में धान का भाव सबसे अच्छा ₹2,450/क्विंटल मिल रहा है। यह जटनी मंडी (₹2,300) से ₹150 अधिक है। फसल को अट्टाबीरा मंडी में बेचना लाभकारी रहेगा।',
        suggestedPrompts: [
          'मूल्य पूर्वानुमान ग्राफ देखें',
          'फसल कटाई का सही समय',
          'सरकारी योजनाएं',
        ],
      };
    }
    return {
      text: '🌾 स्मार्ट कृषि सहायक: मैंने आपके खेत (3 एकड़ धान, खोरधा) की जानकारी देखी है। आज मुख्य सलाह यह है कि कल की बारिश से पहले जलनिकासी की नालियां साफ रखें। आप फसल, कीट, खाद या मंडी भाव के बारे में पूछ सकते हैं।',
      suggestedPrompts: [
        'कल बारिश होने पर क्या करें?',
        'धान में कौन सी खाद डालें?',
        'आसपास की मंडियों के भाव',
        'पौधे की बीमारी की जांच करें',
      ],
    };
  }

  // Odia matches
  if (lang === 'or') {
    if (q.includes('ବର୍ଷା') || q.includes('ପାଣି') || q.includes('ଜଳସେଚନ') || q.includes('କାଲି')) {
      return {
        text: '🌧️ କୃଷି ପରାମର୍ଶ: କାଲି ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ପ୍ରବଳ ବର୍ଷା (୭୨% ସମ୍ଭାବନା) ହେବାର ପୂର୍ବାନୁମାନ ଅଛି। ଆଜି ଜଳସେଚନ କରନ୍ତୁ ନାହିଁ ଏବଂ କୀଟନାଶକ ବା ସାର ପ୍ରୟୋଗ ସ୍ଥଗିତ ରଖନ୍ତୁ।',
        suggestedPrompts: [
          'ବର୍ଷା ପରେ କେଉଁ ସାର ଦେବେ?',
          'ପାଣି ଜମିବାକୁ କିପରି ରୋକିବେ?',
          'ମଣ୍ଡି ଦର ଦେଖନ୍ତୁ',
        ],
      };
    }
    if (q.includes('ସାର') || q.includes('ୟୁରିଆ') || q.includes('ପଟାସ')) {
      return {
        text: '🧪 ସାର ପରିଚାଳନା: ଧାନ ଫସଲର ଦାନା ପୂରଣ ଅବସ୍ଥାରେ ଅଧିକ ୟୁରିଆ ଦିଅନ୍ତୁ ନାହିଁ। ବର୍ଷା ଛାଡିବା ପରେ ଏକର ପିଛା ୧୫ କେଜି ପଟାସ ଦିଅନ୍ତୁ ଯାହା ଫଳରେ ଧାନର ଓଜନ ଏବଂ ଚମକ ବଢ଼ିବ।',
        suggestedPrompts: [
          'ଜୈବିକ କୀଟନାଶକ କିପରି ବ୍ୟବହାର କରିବେ?',
          'ଫସଲ ରୋଗ ଯାଞ୍ଚ କରନ୍ତୁ',
          'ସରକାରୀ ଯୋଜନା ବିବରଣୀ',
        ],
      };
    }
    return {
      text: '🌾 ସ୍ମାର୍ଟ କୃଷି ସହାୟକ: ଆପଣଙ୍କ ଧାନ କ୍ଷେତ (ଖୋର୍ଦ୍ଧା) ପାଇଁ ଆଜିର ମୁଖ୍ୟ ପରାମର୍ଶ ହେଉଛି କାଲିର ବର୍ଷା ପୂର୍ବରୁ କ୍ଷେତରୁ ପାଣି ନିଷ୍କାସନ ନାଳି ସଫା ରଖନ୍ତୁ। ଆପଣ ଫସଲ, ରୋଗ, ସାର କିମ୍ବା ମଣ୍ଡି ଦର ବିଷୟରେ ପଚାରିପାରିବେ।',
      suggestedPrompts: [
        'କାଲି ବର୍ଷା ହେଲେ କଣ କରିବା ଉଚିତ?',
        'ଧାନ ଫସଲ ପାଇଁ ଉତ୍ତମ ସାର',
        'ନିକଟସ୍ଥ ମଣ୍ଡି ଦର',
        'ଫଟୋ ଉଠାଇ ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ',
      ],
    };
  }

  // Telugu matches
  if (lang === 'te') {
    return {
      text: '🌧️ వ్యవసాయ సలహా: రేపు మీ ప్రాంతంలో భారీ వర్షం (72% అవకాశం) కురిసే అవకాశం ఉంది. ఈ రోజు నీటిపారుదల చేయవద్దు మరియు ఎరువులు, పురుగుమందుల పిచికారీని వాయిదా వేయండి. అట్టాబీరా మార్కెట్లో క్వింటాలుకు ₹2,450 ఉత్తమ ధర లభిస్తోంది.',
      suggestedPrompts: [
        'రేపు వర్షం పడితే ఏమి చేయాలి?',
        'వరి పంటకు ఏ ఎరువు వేయాలి?',
        'సమీప మార్కెట్ ధరలు',
      ],
    };
  }

  // Malayalam matches
  return {
    text: '🌧️ കാർഷിക ഉപദേശം: നാളെ നിങ്ങളുടെ പ്രദേശത്ത് കനത്ത മഴയ്ക്ക് (72% സാധ്യത) സാധ്യതയുണ്ട്. ഇന്ന് നനയ്ക്കുന്നത് ഒഴിവാക്കുക, വളപ്രയോഗം മാറ്റിവയ്ക്കുക. അട്ടാബിറ മണ്ടിയിൽ ക്വിന്റലിന് ₹2,450 ഉയർന്ന നിരക്ക് ലഭിക്കുന്നുണ്ട്.',
    suggestedPrompts: [
      'മഴ പെയ്താൽ എന്തുചെയ്യണം?',
      'നെല്ലിന് അനുയോജ്യമായ വളം',
      'വിപണി നിരക്കുകൾ പരിശോധിക്കുക',
    ],
  };
}
