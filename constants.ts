
import { Product, Coupon, Order, ShippingOption } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "真絲圍裹式襯衫",
    price: 120,
    category: "服飾",
    image: "https://picsum.photos/id/338/600/800",
    description: "奢華的 100% 真絲圍裹式襯衫，柔和的腮紅色調。非常適合辦公室穿搭或優雅的晚宴。",
    tags: ['best-seller']
  },
  {
    id: 2,
    name: "高腰亞麻寬褲",
    price: 85,
    category: "服飾",
    image: "https://picsum.photos/id/1005/600/800",
    description: "透氣的亞麻長褲，搭配修飾身形的高腰與寬褲管剪裁。輕鬆展現隨性時尚的定義。",
    tags: ['new']
  },
  {
    id: 3,
    name: "碎花中長版夏日洋裝",
    price: 145,
    category: "服飾",
    image: "https://picsum.photos/id/349/600/800",
    description: "這款精緻的碎花洋裝捕捉了夏日的精髓。配有可調節肩帶和隱形側拉鍊。",
    tags: ['new', 'best-seller']
  },
  {
    id: 4,
    name: "極簡金飾項鍊",
    price: 210,
    category: "珠寶",
    image: "https://picsum.photos/id/64/600/800",
    description: "18k 鍍金吊墜搭配細鍊。為任何裝扮增添一抹精緻感的永恆單品。",
    tags: ['best-seller']
  },
  {
    id: 5,
    name: "經典真皮托特包",
    price: 295,
    category: "配件",
    image: "https://picsum.photos/id/1011/600/800",
    description: "採用義大利真皮手工製作。空間寬敞，可容納筆記型電腦和日常必需品，同時不失風格。",
    tags: ['sale']
  },
  {
    id: 6,
    name: "羊絨混紡圍巾",
    price: 65,
    category: "配件",
    image: "https://picsum.photos/id/823/600/800",
    description: "超柔軟的羊絨與羊毛混紡圍巾，中性米色調。寒冷夜晚的完美配件。",
    tags: ['sale']
  },
  {
    id: 7,
    name: "修身西裝外套",
    price: 180,
    category: "服飾",
    image: "https://picsum.photos/id/445/600/800",
    description: "剪裁俐落的西裝外套，讓您成為眾人焦點。全內襯設計，配有實用口袋。",
    tags: ['new']
  },
  {
    id: 8,
    name: "珍珠垂墜耳環",
    price: 90,
    category: "珠寶",
    image: "https://picsum.photos/id/201/600/800",
    description: "懸掛於金鉤上的淡水珍珠。優雅、經典，適合敏感肌膚配戴。",
    tags: ['new']
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    description: "新會員首購 9 折",
    discountType: "percent",
    value: 0.9,
    minSpend: 0
  },
  {
    code: "SUMMER2024",
    description: "夏日特賣滿 $200 現折 $30",
    discountType: "fixed",
    value: 30,
    minSpend: 200
  },
  {
    code: "VIP50",
    description: "VIP 專屬 $50 折扣",
    discountType: "fixed",
    value: 50,
    minSpend: 300
  }
];

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: '711', name: '7-11 超商取貨', price: 60, description: '預計 2-3 天送達 (模擬賣貨便)' },
  { id: 'home', name: '宅配到府', price: 100, description: '黑貓/順豐，隔日送達' },
  { id: 'shopee', name: '蝦皮店到店', price: 45, description: '預計 3-5 天送達 (模擬)' }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-03-15",
    total: 320,
    status: "已完成",
    refundStatus: "無",
    items: [
      { ...PRODUCTS[4], quantity: 1 },
      { ...PRODUCTS[7], quantity: 1 }
    ],
    shippingMethod: SHIPPING_OPTIONS[1],
    shippingCost: 0
  },
  {
    id: "ORD-2024-045",
    date: "2024-05-20",
    total: 85,
    status: "已出貨",
    refundStatus: "無",
    items: [
      { ...PRODUCTS[1], quantity: 1 }
    ],
    shippingMethod: SHIPPING_OPTIONS[0],
    shippingCost: 60
  }
];

export const MEMBER_TIERS = [
  {
    name: '一般會員',
    threshold: 0,
    benefits: ['新品資訊優先通知', '生日當月 95 折', '累積購物積分']
  },
  {
    name: '銀卡會員',
    threshold: 500,
    benefits: ['全館商品 95 折', '生日禮金 $20', '每季專屬優惠券', '單筆滿 $100 免運費']
  },
  {
    name: '金卡會員',
    threshold: 1500,
    benefits: ['全館商品 9 折', '生日禮金 $50', '新品預購權', '無門檻免運費', '優先客服']
  },
  {
    name: '鑽石會員',
    threshold: 3000,
    benefits: ['全館商品 85 折', '生日禮金 $100', '專屬 AI 造型顧問', '免費退換貨服務', '年度 VIP 禮盒']
  }
];

export const CATEGORIES_DATA = [
  { id: 'apparel', name: '時尚服飾', image: 'https://picsum.photos/id/1005/600/800', filter: '服飾', subtitle: '優雅剪裁' },
  { id: 'jewelry', name: '精緻珠寶', image: 'https://picsum.photos/id/64/600/800', filter: '珠寶', subtitle: '點綴光彩' },
  { id: 'accessories', name: '質感配件', image: 'https://picsum.photos/id/1011/600/800', filter: '配件', subtitle: '完美細節' },
];

// Placeholder image for demo purposes (a woman standing)
export const MOCK_TRY_ON_PHOTO = "https://picsum.photos/id/64/800/1200";
