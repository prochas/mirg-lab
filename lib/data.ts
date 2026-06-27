export type Product = {
  name: string;
  price: string;
  material: string;
  img: string;
};

export const products: Product[] = [
  {
    name: "Halo Solitaire",
    price: "$1,280",
    material: "18k recycled gold · 0.5ct",
    img: "halo_solitaire.jpg",
  },
  {
    name: "Twisted Band",
    price: "$640",
    material: "18k recycled gold",
    img: "twisted_band.jpg",
  },
  {
    name: "Signet Minimal",
    price: "$420",
    material: "Sterling silver",
    img: "signet_minimal.jpg",
  },
  {
    name: "Pavé Eternity",
    price: "$1,950",
    material: "Platinum · pavé set",
    img: "pave_eternity.jpg",
  },
];

export type Category = {
  name: string;
  count: string;
  img: string;
};

export const categories: Category[] = [
  { name: "Engagement", count: "24 rings", img: "cat_engagement.jpg" },
  { name: "Everyday", count: "38 rings", img: "cat_everyday.jpg" },
  { name: "Statement", count: "16 rings", img: "cat_statement.jpg" },
];

export const navLinks = [
  { label: "Rings", href: "#rings" },
  { label: "Collections", href: "#collections" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
