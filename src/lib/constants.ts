export const SITE = {
  name: "禮盒王",
  tagline: "由日本直送・為你傳遞心意",
  description: "日本直送高級禮盒專家",
  url: "https://lihewang.com",
  phone: "+852 5111 1234",
  email: "hello@lihewang.com",
  address: "香港荔枝角青山道 123 號 11 樓",
  businessReg: "商業登記：12345678",
  social: {
    instagram: "@lihewang",
    facebook: "禮盒王",
  },
} as const;

export const CATEGORIES = [
  { slug: "hokkaido", name: "北海道", image: "/categories/hokkaido.jpg" },
  { slug: "tokyo", name: "東京", image: "/categories/tokyo.jpg" },
  { slug: "kyoto", name: "京都", image: "/categories/kyoto.jpg" },
  { slug: "seasonal", name: "季節限定", image: "/categories/seasonal.jpg" },
] as const;

export const NAV_LINKS = [
  { href: "/products", label: "產品" },
  { href: "/about", label: "關於我們" },
  { href: "/wholesale/apply", label: "批發申請" },
] as const;
