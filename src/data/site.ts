export const site = {
  name: "Benji Peng, Ph.D.",
  headline: "Scientist & Entrepreneur",
  url: "https://benji.appcubic.com",
  title: "Benji Peng, Ph.D.",
  description:
    "Benji Peng, Ph.D. — scientist & entrepreneur. Profiles and projects in one place.",
  locale: "en_US",
  gaMeasurementId: "G-6L7V5YG0QJ",
};

export interface LinkItem {
  icon: string;
  label: string;
  href: string;
  color: string;
}

export const links: LinkItem[] = [
  { icon: "github", label: "GitHub", href: "https://github.com/benjipeng", color: "#8b5cf6" },
  { icon: "scholar", label: "Google Scholar", href: "https://scholar.google.com/citations?user=hrK_hacAAAAJ&hl=en", color: "#4285f4" },
  { icon: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/benjiph", color: "#0077b5" },
  { icon: "x", label: "Find me on X", href: "https://x.com/benjipeng", color: "#5c6470" },
  { icon: "discord", label: "Discord", href: "https://discordapp.com/users/787673267657244682", color: "#7289da" },
  { icon: "telegram", label: "Telegram", href: "https://t.me/itglue", color: "#25a3e1" },
];
