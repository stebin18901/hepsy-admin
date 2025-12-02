import React, { useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  Animated,
  StatusBar,
  Alert,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Category =
  | "All"
  | "Books"
  | "Pens"
  | "Art"
  | "Geometry"
  | "Bags"
  | "Combos";

type Product = {
  id: string;
  title: string;
  price: number;
  rating: number; // 0-5
  image: string;
  category: Category;
  bestseller?: boolean;
  description?: string;
};

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Rainbow Story Book Set (5 pcs)",
    price: 249,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1523473827532-3f7d6f2d2c87?auto=format&fit=crop&w=800&q=60",
    category: "Books",
    bestseller: true,
    description: "Colorful story books perfect for ages 6-9.",
  },
  {
    id: "p2",
    title: "Gel Pens - 12 Color Pack",
    price: 129,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1601597115593-44f39b1a93a3?auto=format&fit=crop&w=800&q=60",
    category: "Pens",
    bestseller: false,
    description: "Smooth writing, fun colors for school projects.",
  },
  {
    id: "p3",
    title: "Art Watercolor Box (24)",
    price: 349,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1526318472351-c75fcf070414?auto=format&fit=crop&w=800&q=60",
    category: "Art",
    bestseller: true,
    description: "Vibrant watercolors with mixing tray.",
  },
  {
    id: "p4",
    title: "Geometry Box (Basic Set)",
    price: 199,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1589820296156-7ea4a2ee1b2e?auto=format&fit=crop&w=800&q=60",
    category: "Geometry",
    bestseller: false,
    description: "Ruler, compass, protractor and set squares.",
  },
  {
    id: "p5",
    title: "School Backpack - Blue Stars",
    price: 1199,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1546413115-8b1b1a2d6f0a?auto=format&fit=crop&w=800&q=60",
    category: "Bags",
    bestseller: true,
    description: "Ergonomic straps and roomy compartments.",
  },
  {
    id: "p6",
    title: "Back to School Combo (Book+Pens)",
    price: 399,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=60",
    category: "Combos",
    bestseller: false,
    description: "Starter combo: 1 book + 1 pen set.",
  },
  {
    id: "p7",
    title: "Crayons Box - 24 Colors",
    price: 159,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1601758123927-9b8e8a8b9a75?auto=format&fit=crop&w=800&q=60",
    category: "Art",
    bestseller: false,
    description: "Non-toxic crayons for creative fun.",
  },
  {
    id: "p8",
    title: "Fancy Fountain Pen (Beginner)",
    price: 279,
    rating: 4.1,
    image:
      "https://images.unsplash.com/photo-1526378720704-604a53f3f6d6?auto=format&fit=crop&w=800&q=60",
    category: "Pens",
    bestseller: false,
    description: "Starter fountain pen with ink cartridge.",
  },
];

export default function MarketPage(): JSX.Element {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [sort, setSort] = useState<"popular" | "low" | "high">("popular");
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

  // small cart button pulse animation
  const pulse = useRef(new Animated.Value(1)).current;
  const animatePulse = () => {
    pulse.setValue(0.9);
    Animated.spring(pulse, { toValue: 1, useNativeDriver: true, friction: 3 }).start();
  };

  const categories: Category[] = [
    "All",
    "Books",
    "Pens",
    "Art",
    "Geometry",
    "Bags",
    "Combos",
  ];

  const filtered = useMemo(() => {
    let items = SAMPLE_PRODUCTS.filter((p) => (category === "All" ? true : p.category === category));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((p) => p.title.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q));
    }
    if (sort === "low") items = items.sort((a, b) => a.price - b.price);
    else if (sort === "high") items = items.sort((a, b) => b.price - a.price);
    else items = items.sort((a, b) => Number(b.bestseller ? 1 : 0) - Number(a.bestseller ? 1 : 0));
    return items;
  }, [category, sort, query]);

  const recommended = useMemo(() => SAMPLE_PRODUCTS.filter((p) => p.bestseller).slice(0, 5), []);

  const toggleWishlist = (id: string) => {
    setWishlist((w) => ({ ...w, [id]: !w[id] }));
  };

  const addToCart = (id: string) => {
    setCart((c) => {
      const next = { ...c, [id]: (c[id] || 0) + 1 };
      return next;
    });
    animatePulse();
  };

  const removeFromCart = (id: string) => {
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return next;
      next[id] = next[id] - 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

  const cartItemsDetailed = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const prod = SAMPLE_PRODUCTS.find((p) => p.id === id)!;
      return { ...prod, qty };
    });
  }, [cart]);

  const cartTotal = cartItemsDetailed.reduce((s, p) => s + p.price * p.qty, 0);

  const renderProduct = ({ item }: { item: Product }) => {
    const wished = wishlist[item.id];
    return (
      <View style={styles.productCard}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productBody}>
          <Text numberOfLines={2} style={styles.productTitle}>
            {item.title}
          </Text>

          <View style={styles.rowBetween}>
            <Text style={styles.price}>₹{item.price}</Text>
            <View style={styles.rating}>
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              <Text style={styles.star}> ★</Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnOutline]}
              onPress={() => toggleWishlist(item.id)}
              accessibilityLabel="Add to wishlist"
            >
              <Text style={[styles.btnOutlineText]}>{wished ? "♥ Wishlisted" : "♡ Wishlist"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={() => addToCart(item.id)}
              accessibilityLabel="Add to cart"
            >
              <Text style={styles.btnPrimaryText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>School Market</Text>
          <Text style={styles.headerSubtitle}>Stationery & essentials for kids</Text>
        </View>

        <TouchableOpacity onPress={() => setCartOpen(true)} style={styles.cartIconWrap}>
          <Animated.View style={[styles.cartIcon, { transform: [{ scale: pulse }] }]}>
            <Text style={styles.cartEmoji}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Search & Filters */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search for books, pens, combos..."
          placeholderTextColor="#94A3B8"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() =>
            setSort((s) => (s === "popular" ? "low" : s === "low" ? "high" : "popular"))
          }
        >
          <Text style={styles.filterText}>
            {sort === "popular" ? "Recommended" : sort === "low" ? "Price: Low→High" : "Price: High→Low"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoryRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
          {categories.map((c) => {
            const active = c === category;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[styles.catChip, active && styles.catChipActive]}
              >
                <Text style={[styles.catText, active && styles.catTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Recommended */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended for you</Text>
      </View>
      <View style={{ height: 140 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
          {recommended.map((r) => (
            <View key={r.id} style={styles.recoCard}>
              <Image source={{ uri: r.image }} style={styles.recoImage} />
              <Text numberOfLines={2} style={styles.recoTitle}>
                {r.title}
              </Text>
              <View style={styles.recoFooter}>
                <Text style={styles.recoPrice}>₹{r.price}</Text>
                <TouchableOpacity onPress={() => addToCart(r.id)} style={styles.recoAdd}>
                  <Text style={styles.recoAddText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
      />

      {/* Cart Modal */}
      <Modal visible={cartOpen} animationType="slide" onRequestClose={() => setCartOpen(false)}>
        <SafeAreaView style={styles.modalWrap}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Cart</Text>
            <TouchableOpacity onPress={() => setCartOpen(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            {cartItemsDetailed.length === 0 && (
              <View style={styles.emptyCart}>
                <Text style={styles.emptyCartText}>Your cart is empty — add some fun supplies!</Text>
              </View>
            )}

            {cartItemsDetailed.map((it) => (
              <View key={it.id} style={styles.cartItem}>
                <Image source={{ uri: it.image }} style={styles.cartItemImage} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cartItemTitle}>{it.title}</Text>
                  <Text style={styles.cartItemPrice}>₹{it.price} × {it.qty}</Text>
                </View>

                <View style={styles.cartQtyRow}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(it.id)}>
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{it.qty}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(it.id)}>
                    <Text style={styles.qtyBtnText}>＋</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Totals */}
            {cartItemsDetailed.length > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalAmount}>₹{cartTotal.toFixed(0)}</Text>
              </View>
            )}
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearBtn} onPress={() => {
              if (cartItemsDetailed.length === 0) return;
              Alert.alert("Clear cart", "Remove all items from cart?", [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: clearCart },
              ]);
            }}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.checkoutBtn, cartItemsDetailed.length === 0 && { backgroundColor: "#CBD5E1" }]}
              disabled={cartItemsDetailed.length === 0}
              onPress={() => Alert.alert("Checkout", `Proceed to pay ₹${cartTotal.toFixed(0)} (demo)`)}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

/* ----------------------------- STYLES ----------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFBF2", // warm kids-friendly background
  },

  /* Header */
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 24,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  cartIconWrap: {
    paddingLeft: 8,
  },
  cartIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  cartEmoji: { fontSize: 22 },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#EF4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FEFBF2",
  },
  cartBadgeText: {
    color: "white",
    fontWeight: "800",
    fontSize: 12,
  },

  /* Search Row */
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 8 as unknown as number, // RN <0.71 doesn't support gap; kept for newer RN - fallback handled by margin
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  filterButton: {
    marginLeft: 8,
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  filterText: {
    color: "#0369A1",
    fontWeight: "700",
  },

  /* Categories */
  categoryRow: {
    paddingTop: 8,
    paddingBottom: 6,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 18,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  catChipActive: {
    backgroundColor: "#FFEDD5",
    borderWidth: 1,
    borderColor: "#FB923C",
  },
  catText: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 13,
  },
  catTextActive: {
    color: "#B45309",
  },

  /* Recommended */
  sectionHeader: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  recoCard: {
    width: 220,
    height: 120,
    marginRight: 12,
    borderRadius: 12,
    padding: 8,
    backgroundColor: "#FFF",
    elevation: 2,
  },
  recoImage: {
    width: "100%",
    height: 64,
    borderRadius: 8,
    marginBottom: 6,
  },
  recoTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  recoFooter: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recoPrice: { fontWeight: "800", color: "#0F172A" },
  recoAdd: {
    backgroundColor: "#FB923C",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  recoAddText: { color: "white", fontWeight: "800" },

  /* Grid */
  grid: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 120,
  },
  productCard: {
    backgroundColor: "white",
    width: (SCREEN_WIDTH - 48) / 2, // 12 + 12 + 12 spacing
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#F8FAFC",
  },
  productBody: {
    padding: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  price: {
    fontWeight: "900",
    color: "#0F172A",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  star: {
    color: "#F59E0B",
    fontSize: 13,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    alignItems: "center",
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 88,
    alignItems: "center",
  },
  btnPrimary: {
    backgroundColor: "#10B981",
  },
  btnPrimaryText: {
    color: "white",
    fontWeight: "800",
  },
  btnOutline: {
    backgroundColor: "#FEFBF2",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  btnOutlineText: {
    color: "#B45309",
    fontWeight: "800",
  },

  /* Cart Modal */
  modalWrap: {
    flex: 1,
    backgroundColor: "#FEFBF2",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  modalClose: {
    padding: 8,
  },
  modalCloseText: {
    color: "#0F172A",
    fontWeight: "700",
  },
  emptyCart: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyCartText: {
    color: "#64748B",
    fontSize: 15,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  cartItemImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  cartItemTitle: {
    fontWeight: "800",
    fontSize: 14,
    color: "#0F172A",
  },
  cartItemPrice: {
    color: "#64748B",
    marginTop: 6,
  },
  cartQtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: "800",
  },
  qtyValue: {
    marginHorizontal: 8,
    fontWeight: "800",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 4,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "900",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "900",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  clearBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearBtnText: {
    color: "#EF4444",
    fontWeight: "800",
  },
  checkoutBtn: {
    backgroundColor: "#FB923C",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 140,
    alignItems: "center",
  },
  checkoutText: {
    color: "white",
    fontWeight: "900",
  },
});
