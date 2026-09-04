const PRIMARY_PHONE = {
  name: "Сергій",
  display: "099 300 22 45",
  international: "+380 99 300 22 45",
  href: "tel:+380993002245",
} as const;

const SECONDARY_PHONE = {
  name: "Анатолій",
  display: "097 629 71 10",
  international: "+380 97 629 71 10",
  href: "tel:+380976297110",
} as const;

export const CONTACTS = {
  phone: PRIMARY_PHONE,

  primaryPhone: PRIMARY_PHONE,

  secondaryPhone: SECONDARY_PHONE,

  email: {
    display: "mebli.4home@gmail.com",
    href: "mailto:mebli.4home@gmail.com",
  },

  instagram: {
    label: "@mebli.4home",
    href: "https://www.instagram.com/mebli.4home/",
  },

  viber: {
    label: "Viber",
    display: "+380 99 300 22 45",
    href: "viber://chat?number=%2B380993002245",
  },

  telegram: {
    label: "Telegram",
    display: "@besteraffilate",
    href: "https://t.me/besteraffilate",
  },
} as const;