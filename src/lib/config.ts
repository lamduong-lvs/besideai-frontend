import { AppConfigPublic } from "./types";

export const appConfig: AppConfigPublic = {
  projectName: "BesideAI",
  projectSlug: "besideai",
  keywords: [
    "BesideAI",
    "AI Assistant",
    "AI Tools",
    "Chrome Extension",
    "Productivity",
    "AI SaaS",
  ],
  description:
    "BesideAI - Your AI-powered productivity assistant.",
  auth: {
    enablePasswordAuth: false, // Set to true to enable password-based authentication
  },
  legal: {
    address: {
      street: "Plot No 337, Workyard, Phase 2, Industrial Business &amp; Park",
      city: "Chandigarh",
      state: "Punjab",
      postalCode: "160002",
      country: "India",
    },
    email: "ssent.hq@gmail.com",
    phone: "+91 9876543210",
  },
  social: {
    twitter: "https://twitter.com/cjsingg",
    instagram: "https://instagram.com/-",
    linkedin: "https://linkedin.com/-",
    facebook: "https://facebook.com/-",
    youtube: "https://youtube.com/-",
  },
  email: {
    senderName: "Indie Kit",
    senderEmail: "ssent.hq@gmail.com",
  },
};
