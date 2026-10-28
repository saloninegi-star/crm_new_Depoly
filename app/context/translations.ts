export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  dir?: "ltr" | "rtl";
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", script: "Latin" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", script: "Devanagari" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", script: "Gurmukhi" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", script: "Bengali" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", script: "Telugu" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", script: "Tamil" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", script: "Gujarati" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", script: "Devanagari" },
  { code: "ur", name: "Urdu", nativeName: "اردو", script: "Perso-Arabic", dir: "rtl" },
];

export const translations: Record<string, Record<string, string>> = {
  // ================= ENGLISH =================
  en: {
    // 🟢 Login Page Keys (Jo pehle missing the)
    sign_in: "Sign in",
    registered_mobile: "We will send a 6-digit code to your registered mobile number.",
    mobile_number: "Mobile number",
    phone_placeholder: "10-digit number",
    send_code: "Send code",
    sending_code: "Sending code...",
    enter_code: "Enter the code",
    code_sent_to: "Sent to",
    change_number: "Change number",
    six_digit_code: "6-digit code",
    verifying: "Verifying...",
    verify_open_dashboard: "Verify and sign in",
    resend_prompt: "Didn't receive code?",
    resend: "Resend code",
    error_valid_mobile: "Please enter a valid 10-digit mobile number.",
    error_valid_code: "Please enter the 6-digit code.",

    // Shell & Navigation
    overview: "Overview",
    gate_entry: "Gate entry",
    weighbridge: "Weighbridge",
    paddy_stock: "Paddy stock",
    milling: "Milling",
    finished_stock: "Finished stock",
    sales_dispatch: "Sales & dispatch",
    accounts: "Accounts",
    reports: "Reports",
    hr_labour: "HR & labour",
    settings: "Settings",

    inward: "INWARD",
    production: "PRODUCTION",
    outward: "OUTWARD",
    money: "MONEY",
    people: "PEOPLE",

    shift_1: "Shift 1",
    live_sync: "Live Mill Sync",
    sign_out: "Sign out",
    confirm_logout_title: "Sign Out Confirmation",
    confirm_logout_desc: "Are you sure you want to sign out of your session? You will need to verify with OTP to log in again.",
    cancel: "Cancel",
    yes_sign_out: "Yes, Sign Out",
  },

  // ================= HINDI =================
  hi: {
    // 🟢 Login Page Keys (Hindi)
    sign_in: "साइन इन करें",
    registered_mobile: "हम आपके पंजीकृत मोबाइल नंबर पर 6 अंकों का कोड भेजेंगे।",
    mobile_number: "मोबाइल नंबर",
    phone_placeholder: "10 अंकों का नंबर",
    send_code: "कोड भेजें",
    sending_code: "कोड भेजा जा रहा है...",
    enter_code: "कोड दर्ज करें",
    code_sent_to: "भेजा गया",
    change_number: "नंबर बदलें",
    six_digit_code: "6-अंकों का कोड",
    verifying: "सत्यापित हो रहा है...",
    verify_open_dashboard: "सत्यापित कर साइन इन करें",
    resend_prompt: "कोड नहीं मिला?",
    resend: "पुनः भेजें",
    error_valid_mobile: "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।",
    error_valid_code: "कृपया 6 अंकों का कोड दर्ज करें।",

    overview: "ओवरव्यू",
    gate_entry: "गेट एंट्री",
    weighbridge: "धर्मकांटा",
    paddy_stock: "धान स्टॉक",
    milling: "मिलिंग",
    finished_stock: "तैयार स्टॉक",
    sales_dispatch: "बिक्री व डिस्पैच",
    accounts: "खाता व बहीखाता",
    reports: "रिपोर्ट्स",
    hr_labour: "एचआर व लेबर",
    settings: "सेटिंग्स",

    inward: "आवक (INWARD)",
    production: "उत्पादन",
    outward: "जावक (OUTWARD)",
    money: "हिसाब-किताब",
    people: "स्टाफ व लेबर",

    shift_1: "शिफ्ट 1",
    live_sync: "लाइव मिल सिंक",
    sign_out: "लॉग आउट",
    confirm_logout_title: "लॉग आउट पुष्टि",
    confirm_logout_desc: "क्या आप वाकई अपने खाते से लॉग आउट करना चाहते हैं?",
    cancel: "रद्द करें",
    yes_sign_out: "हाँ, लॉग आउट करें",
  },

  // ================= PUNJABI =================
  pa: {
    sign_in: "ਸਾਈਨ ਇਨ ਕਰੋ",
    registered_mobile: "ਅਸੀਂ ਤੁਹਾਡੇ ਰਜਿਸਟਰਡ ਮੋਬਾਈਲ ਨੰਬਰ 'ਤੇ 6-ਅੰਕਾਂ ਦਾ ਕੋਡ ਭੇਜਾਂਗੇ।",
    mobile_number: "ਮੋਬਾਈਲ ਨੰਬਰ",
    phone_placeholder: "10-ਅੰਕਾਂ ਦਾ ਨੰਬਰ",
    send_code: "ਕੋਡ ਭੇਜੋ",
    sending_code: "ਕੋਡ ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    enter_code: "ਕੋਡ ਦਰਜ ਕਰੋ",
    code_sent_to: "ਭੇਜਿਆ ਗਿਆ",
    change_number: "ਨੰਬਰ ਬਦਲੋ",
    six_digit_code: "6-ਅੰਕਾਂ ਦਾ ਕੋਡ",
    verifying: "ਪੁਸ਼ਟੀ ਹੋ ਰਹੀ ਹੈ...",
    verify_open_dashboard: "ਪੁਸ਼ਟੀ ਕਰਕੇ ਸਾਈਨ ਇਨ ਕਰੋ",
    resend_prompt: "ਕੋਡ ਨਹੀਂ ਮਿਲਿਆ?",
    resend: "ਮੁੜ ਭੇਜੋ",
    error_valid_mobile: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ 10-ਅੰਕੀ ਮੋਬਾਈਲ ਨੰਬਰ ਦਾਖਲ ਕਰੋ।",
    error_valid_code: "ਕਿਰਪਾ ਕਰਕੇ 6-ਅੰਕਾਂ ਦਾ ਕੋਡ ਦਰਜ ਕਰੋ।",

    overview: "ਓਵਰਵਿਊ",
    gate_entry: "ਗੇਟ ਐਂਟਰੀ",
    weighbridge: "ਕੰਡਾ / ਵਜ਼ਨ",
    paddy_stock: "ਝੋਨਾ ਸਟਾਕ",
    milling: "ਮਿਲਿੰਗ",
    finished_stock: "ਤਿਆਰ ਚੌਲ ਸਟਾਕ",
    sales_dispatch: "ਵਿਕਰੀ ਤੇ ਡਿਸਪੈਚ",
    accounts: "ਖਾਤਾ ਤੇ ਹਿਸਾਬ",
    reports: "ਰਿਪੋਰਟਾਂ",
    hr_labour: "ਸਟਾਫ ਤੇ ਲੇਬਰ",
    settings: "ਸੈਟਿੰਗਾਂ",

    inward: "ਆਵਕ",
    production: "ਉਤਪਾਦਨ",
    outward: "ਜਾਵਕ",
    money: "ਹਿਸਾਬ-ਕਿਤਾਬ",
    people: "ਸਟਾਫ",

    cancel: "ਰੱਦ ਕਰੋ",
    yes_sign_out: "ਹਾਂ, ਲੌਗ ਆਉਟ",
  }
};