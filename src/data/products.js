// Atölyenin ürün kataloğu. Yeni ürün eklemek için bu diziye bir obje eklemek yeterli.
// price: ₺ cinsinden sayı (ekranda ProductCard biçimlendirir)
// inStock: false olan ürünlerde ileride "Stok Bildirimi İste" formu gösterilecek
export const products = [
  {
    id: 'hus-kuksa',
    name: 'Huş Kuksa',
    category: 'kuksa',
    price: 1450,
    description: "Tek parça huş ağacından elde oyulmuş, 200 ml'lik geleneksel kamp bardağı. Doğal yağ ile cilalanır.",
    emoji: '🥣',
    inStock: true,
  },
  {
    id: 'ceviz-yemek-kasigi',
    name: 'Ceviz Yemek Kaşığı',
    category: 'kasik',
    price: 380,
    description: 'Ceviz ağacından bıçakla yontulmuş günlük kullanım kaşığı. Her biri kendi damar deseniyle tektir.',
    emoji: '🥄',
    inStock: true,
  },
  {
    id: 'kiraz-olcu-kasigi',
    name: 'Kiraz Kahve Ölçü Kaşığı',
    category: 'kasik',
    price: 290,
    description: 'Kiraz ağacından, yaklaşık 7 gram kahve alan kısa saplı ölçü kaşığı. Kavanozda saklamaya uygun.',
    emoji: '☕',
    inStock: false,
  },
]
