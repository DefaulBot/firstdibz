/** Centralised company info — single source of truth for all pages. */

export const COMPANY = {
  name: "Firs' Dibs BZ",
  tagline: "Pay half now. Pay the rest later.",
  founded: "January 2026",
  country: "Belize",
  city: "Belize City",

  phone: "+501 600-5750",
  whatsapp: "https://wa.me/5016005750",
  email: "firsdibz@gmail.com",
  careersEmail: "careers@firsdibs.bz",

  instagram: "https://www.instagram.com/firs_dibz?igsh=d254b25iajE3dHR6",
  instagramHandle: "@firsdibsbz",

  digiwalletId: "600-5750",
  eykashEmail: "firsdibz@eykash.com",

  hours: [
    { day: "Monday", time: "10:00 a.m. – 5:30 p.m." },
    { day: "Tuesday", time: "10:00 a.m. – 5:30 p.m." },
    { day: "Wednesday", time: "10:00 a.m. – 5:30 p.m." },
    { day: "Thursday", time: "10:00 a.m. – 5:30 p.m." },
    { day: "Friday", time: "10:00 a.m. – 5:30 p.m." },
    { day: "Saturday", time: "10:00 a.m. – 3:00 p.m." },
    { day: "Sunday", time: "Closed" },
  ],

  hoursShort: {
    weekday: "Mon – Fri: 10 a.m. – 5:30 p.m.",
    saturday: "Sat: 10 a.m. – 3 p.m.",
    sunday: "Sun: Closed",
  },
} as const;
