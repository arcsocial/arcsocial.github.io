// translations.js - Handles translations and i18n helpers

const TRANSLATIONS = {
  'en': {
    'search': 'Search',
    'clear': 'Clear',
    'processing': 'Processing...',
    'author': 'Author',
    'searchtext': 'Book title, author ...',
    'genre': 'Genre',
    'ageGroup': 'Age Group',
    'noResults': 'No books found',
    'newSearch': 'New Search',
    'title': 'ARC Social Library',
    'tagline': 'Library in Aundh, Pune offering Marathi and English books. We have a tie-up with Pune Marathi Granthalay giving you access to over 1.25 lakh books. We do various art, reading and craft activites building an engaging community for residents of Aundh. Join us to explore your creativity and part-take in our upcoming activities.',
    'browse': 'Browse our collection',
    'newBooks': 'Newly Added Books',
    'activities': 'Upcoming Activities',
    'address': "📍 <a href='https://www.google.com/maps/place/ARC+Social/@18.5553097,73.8034296,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bf0056f0363d:0x5b1ce2587e0ab00c!8m2!3d18.5553097!4d73.8060045!16s%2Fg%2F11w7r3hklb?entry=ttu&g_ep=EgoyMDI1MDMyNS4xIKXMDSoASAFQAw%3D%3D' target='_blank'>Shop 1, Building-C, Chintamani Nagar, Sanewadi, Aundh, Pune, Maharashtra</a>",
    'contact': "💬 <a href='https://wa.me/+918468919411' target='_blank' style='color: #2e7d32; text-decoration: none;'>84689 19411</a>",
    'timing': "⏰ Mon-Sat 10am-1pm & 5pm-8pm",
    'mail': "✉️ <a href='mailto:arcsoocial@gmail.com' style='color: #2e7d32;'>arcsoocial@gmail.com</a>",
    'instagram': "📷 <a href='https://www.instagram.com/arcsoocial' target='_blank'>Instagram</a>"
  },
  'mr': {
    'search': 'शोधा',
    'clear': 'पुसा',
    'processing': 'प्रक्रिया सुरू आहे...',
    'author': 'लेखक',
    'searchtext': 'पुस्तक नाव, लेखक ...',
    'genre': 'प्रकार',
    'ageGroup': 'वय गट',
    'noResults': 'पुस्तके सापडली नाहीत',
    'newSearch': 'नवीन शोध',
    'title': 'ARC Social Library',
    'tagline': 'औंध, पुणे येथील मराठी व इंग्रजी पुस्तकांचे उत्तम वाचनालय. आमचे पुणे मराठी ग्रंथालयाशी संलग्नत्व असून त्यामार्फत आम्हाला १.२५ लाखांहून अधिक पुस्तकांचा खजिना तुम्हाला उपलब्ध करुन देतो. आम्ही विविध कला, वाचन व हस्तकला उपक्रम राबवून औंध परिसरातील रहिवाशांसाठी एक उत्साही व सक्रीय समुदाय उभारतो. तुमच्या सर्जनशीलतेचा शोध घेण्यासाठी व आगामी उपक्रमांमध्ये सहभागी होण्यासाठी आमच्यात सामील व्हा.',
    'browse': 'आमचा पुस्तक संग्रह',
    'newBooks': 'नवीन पुस्तके',
    'activities': 'आगामी उपक्रम',
    'address': "📍 <a href='https://www.google.com/maps/place/ARC+Social/@18.5553097,73.8034296,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bf0056f0363d:0x5b1ce2587e0ab00c!8m2!3d18.5553097!4d73.8060045!16s%2Fg%2F11w7r3hklb?entry=ttu&g_ep=EgoyMDI1MDMyNS4xIKXMDSoASAFQAw%3D%3D' target='_blank'>C1, चिंतामणी नगर, सानेवाडी, औंध, पुणे</a>",
    'contact': "💬 <a href='https://wa.me/+918468919411' target='_blank' style='color: #2e7d32; text-decoration: none;'>८४६८९ १९४११</a>",
    'timing': "⏰ सोमवार - शनिवार सकाळी १० - १ & संध्याकाळी 5 - 8",
    'mail': "✉️ <a href='mailto:arcsoocial@gmail.com' style='color: #2e7d32;'>arcsoocial@gmail.com</a>",
    'instagram': "📷 <a href='https://www.instagram.com/arcsoocial' target='_blank'>Instagram</a>"
  }
};

export function getTranslations(language) {
  return TRANSLATIONS[language] || TRANSLATIONS['en'];
} 
