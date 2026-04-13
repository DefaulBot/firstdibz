"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { searchItems } from "@/lib/dataSource";
import { Button } from "@/components/ui/Button";
import { StarIcon, ShoppingBagIcon, FireIcon } from "@/components/DividerIcons";
export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Women Clothing");

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        // Search for diverse products to get variety
        const searchQueries = [
          "necklace",
          "bracelet",
          "ring",
          "jewelry",
          "watch",
          "phone",
          "shirt",
          "dress",
          "bag",
          "shoes",
          "electronics",
          "accessories",
          "pendant",
          "chain",
          "clothing",
          "fashion",
        ];

        const allResults: any[] = [];

        for (const query of searchQueries) {
          try {
            console.log("Searching VShop for:", query);
            const { items, source } = await searchItems({ q: query });
            console.log(`Found ${items.length} items from ${source}`);
            allResults.push(...items);
          } catch (e) {
            console.error(`Search for "${query}" failed:`, e);
          }
        }

        // Remove duplicates and shuffle
        const uniqueItems = Array.from(
          new Map(allResults.map((item) => [item.id, item])).values(),
        );
        const shuffled = uniqueItems.sort(() => Math.random() - 0.5);
        setFeatured(shuffled.slice(0, 20)); // Get more items for carousel
      } catch (error) {
        console.error("Failed to load featured items:", error);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  return (
    <div className="mt-40 md:mt-44">
      {/* Categories Navigation */}
      <CategoriesNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        router={router}
      />

      {/* Section Divider */}
      <div className="flex items-center justify-center gap-4 px-4 py-2">
        <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#1F2661] to-transparent" />
        <StarIcon />
        <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#1F2661] to-transparent" />
      </div>

      {/* Hero Slider */}
      <HeroSlider />

      {/* Section Divider */}
      <div className="flex items-center justify-center gap-4 px-4 py-2">
        <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#1F2661] to-transparent" />
        <ShoppingBagIcon />
        <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#1F2661] to-transparent" />
      </div>

      {/* CTA Categories Section */}
      <CTASection />

      {/* Section Divider */}
      <div className="flex items-center justify-center gap-4 px-4 py-2">
        <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#1F2661] to-transparent" />
        <FireIcon />
        <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#1F2661] to-transparent" />
      </div>

      {/* Featured Items Section */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#1F2661] sm:text-3xl">
              Top Items
            </h2>
            <div className="mt-1 h-1 w-20 bg-gradient-to-r from-[#1F2661] to-[#7FF46A]" />
          </div>
          <Link
            href="/search"
            className="flex items-center gap-1 text-sm font-semibold text-[#7FF46A] transition-all hover:gap-2"
          >
            View All <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#1F2661] border-t-[#7FF46A]" />
              <p className="text-zinc-600">Loading items...</p>
            </div>
          </div>
        ) : featured.length > 0 ? (
          <FeaturedItemsCarousel items={featured} />
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-zinc-600">No items available</p>
          </div>
        )}
      </section>
    </div>
  );
}

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Summer Collection 2024",
      description:
        "Discover the hottest trends of the season with up to 60% off. Reserve now, pay later with Firs' Dibs BZ!",
      cta: "SHOP NOW",
      bgImage:
        "url('https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=1600')",
      bgColor: "linear-gradient(135deg, #FF6B6B 0%, #FF8E72 100%)",
    },
    {
      title: "New Arrivals Every Day",
      description:
        "Fresh styles added daily. Don't miss out on the latest fashion. Be the first to reserve!",
      cta: "EXPLORE NEW",
      bgImage:
        "url('https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1600')",
      bgColor: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
    },
    {
      title: "Flash Sale: 24 Hours Only",
      description:
        "Up to 70% off on selected items. Limited time offer! Reserve your favorites now!",
      cta: "SHOP SALE",
      bgImage:
        "url('https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1600')",
      bgColor: "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-2">
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
      >
        <div className="relative h-96 sm:h-[450px]">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(15,47,99,0.4), rgba(15,47,99,0.4)), ${slide.bgImage}`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: slide.bgColor,
                backgroundBlendMode: "darken",
              }}
            >
              {/* Slide Content - Bottom Left */}
              <div
                className="absolute bottom-12 left-12 max-w-sm text-white"
                style={{
                  animation:
                    index === currentSlide
                      ? "slideInLeft 0.8s ease forwards"
                      : "none",
                }}
              >
                <div className="rounded-2xl bg-[rgba(15,47,99,0.85)] backdrop-blur-sm p-8 border border-white/20">
                  <h2
                    className="text-4xl font-black mb-3 font-montserrat leading-tight"
                    style={{
                      animation:
                        index === currentSlide
                          ? "fadeInUp 0.8s ease forwards"
                          : "none",
                    }}
                  >
                    {slide.title}
                  </h2>
                  <p
                    className="text-lg mb-6 opacity-95"
                    style={{
                      animation:
                        index === currentSlide
                          ? "fadeInUp 0.8s ease 0.2s forwards"
                          : "none",
                    }}
                  >
                    {slide.description}
                  </p>
                  <Link
                    href="/search"
                    style={{
                      animation:
                        index === currentSlide
                          ? "fadeInUp 0.8s ease 0.4s forwards"
                          : "none",
                    }}
                  >
                    <Button className="bg-[#7FF46A] hover:bg-[#7FF46A]/90 text-[#1F2661] hover:shadow-lg transform hover:-translate-y-1 transition-transform">
                      {slide.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Dots - Bottom Center */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white scale-125 w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const categories = [
    {
      title: "Women Clothing",
      image:
        "https://img.ltwebstatic.com/images3_pi/2024/03/19/9e/17107777599287d3af5eba4a73afb438b9c26aaf3a_thumbnail_220x293.webp",
      link: "/search?q=women%20clothing",
    },
    {
      title: "Beachwear",
      image:
        "https://img.ltwebstatic.com/v4/j/pi/2026/01/15/9f/176847207797982349cedc21b18f5079e40e7ac917_thumbnail_220x293.webp",
      link: "/search?q=beachwear",
    },
    {
      title: "Curve",
      image:
        "https://img.ltwebstatic.com/v4/j/pi/2025/12/29/71/176698436893c14b8c3bf02d543bf8071e3f979d62_thumbnail_220x293.webp",
      link: "/search?q=plusesize",
    },
    {
      title: "Kids",
      image:
        "https://img.kwcdn.com/product/fancy/a2e259ca-18bd-485a-960b-0b42c1216274.jpg?imageView2/2/w=800/q=70/format/avif",
      link: "/search?q=kids",
    },
    {
      title: "Men Clothing",
      image:
        "https://img.ltwebstatic.com/images3_pi/2023/05/10/16837128616e44104a282aeb523521b1c23c4badba_thumbnail_220x293.webp",
      link: "/search?q=men%20clothing",
    },
    {
      title: "Home & Living",
      image:
        "https://img.ltwebstatic.com/v4/j/spmp/2025/09/15/a5/175792409316f9577b41a18eb0de7a1fa83e8fd1e5_thumbnail_220x293.webp",
      link: "/search?q=home%20living",
    },
    {
      title: "Underwear & Sleepwear",
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      link: "/search?q=underwear",
    },
    {
      title: "Shoes",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      link: "/search?q=shoes",
    },
    {
      title: "Jewelry & Accessories",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      link: "/search?q=jewelry",
    },
    {
      title: "Beauty & Health",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      link: "/search?q=beauty",
    },
    {
      title: "Home Textiles",
      image:
        "https://img.ltwebstatic.com/images3_spmp/2024/04/10/63/1712715288635069a2058dff1eb13d46d26f05a565_thumbnail_220x293.webp",
      link: "/search?q=home%20textiles",
    },
    {
      title: "Cell Phone Accessories",
      image:
        "https://img.ltwebstatic.com/images3_spmp/2024/02/16/be/170806266424f321964ba9e13b5ea9d38dcdb34509_thumbnail_220x293.webp",
      link: "/search?q=phone%20accessories",
    },
    {
      title: "Electronics",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      link: "/search?q=electronics",
    },
    {
      title: "Sports & Outdoors",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      link: "/search?q=sports",
    },
    {
      title: "Toys & Games",
      image:
        "https://img.ltwebstatic.com/v4/j/spmp/2025/07/18/5e/175283117124334d8d7f46b12811261803423e0159_thumbnail_220x293.webp",
      link: "/search?q=toys",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="mb-12 text-center">
        <h2 className="text-2xl sm:text-4xl font-black text-[#1F2661] mb-4 font-montserrat">
          SHOP ALL CATEGORIES
        </h2>
        <div className="flex justify-center mb-4">
          <div className="h-1 w-32 bg-gradient-to-r from-[#1F2661] to-[#7FF46A]" />
        </div>
        <p className="mt-4 text-zinc-600 max-w-2xl mx-auto">
          Explore our wide selection of categories. Find everything you love,
          reserve now with Firs' Dibs BZ!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.title} href={category.link} className="group">
            <div
              className="relative rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 p-4 border-t-4 border-gradient-to-r border-t-[#7FF46A] hover:-translate-y-2"
              style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
            >
              {/* Circular Image */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#f0f0f0] group-hover:border-[#7FF46A] transition-colors">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Title */}
              <h3 className="font-semibold text-[#1F2661] text-xs sm:text-sm text-center group-hover:text-[#7FF46A] transition-colors">
                {category.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CategoriesNav({
  selectedCategory,
  onSelectCategory,
  router,
}: {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  router: ReturnType<typeof useRouter>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = [
    "Women Clothing",
    "Beachwear",
    "Curve",
    "Kids",
    "Men Clothing",
    "Home & Living",
    "Underwear & Sleepwear",
    "Shoes",
    "Jewelry & Accessories",
    "Beauty & Health",
    "Home Textiles",
    "Cell Phone Accessories",
    "Electronics",
    "Sports & Outdoors",
    "Toys & Games",
    "Baby & Maternity",
    "Bags & Luggage",
    "Tools & Home Improvement",
    "Office & School Supplies",
    "Pet Supplies",
    "Appliances",
  ];

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const scrollAmount = 150;
    if (direction === "left") {
      containerRef.current.scrollLeft -= scrollAmount;
    } else {
      containerRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <nav className="fixed top-[114px] left-0 right-0 z-40 bg-white border-b border-[#8C9FAE]/30 shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative flex items-center">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border-2 border-[#1F2661] text-[#1F2661] shadow-md hover:bg-[#1F2661] hover:text-white transition-all flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Categories Container */}
          <div
            ref={containerRef}
            className="flex gap-3 overflow-x-auto scroll-smooth py-4 px-12"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onSelectCategory(category);
                  const query = category.toLowerCase().replace(/\s+/g, "+");
                  router.push(`/search?q=${query}`);
                }}
                className={`flex-shrink-0 px-5 py-3 rounded-full font-semibold text-base whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-[#1F2661] text-white shadow-md hover:shadow-lg"
                    : "bg-[#D9EBDD] text-[#1F2661] hover:bg-[#1F2661] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border-2 border-[#1F2661] text-[#1F2661] shadow-md hover:bg-[#1F2661] hover:text-white transition-all flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

function FeaturedItemsCarousel({ items }: { items: any[] }) {
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate items for infinite scroll effect
  const displayItems = [...items, ...items];

  useEffect(() => {
    if (!isAutoScroll || !containerRef.current) return;

    const container = containerRef.current;
    let scrollAmount = 0;

    const interval = setInterval(() => {
      scrollAmount += 2;
      container.scrollLeft = scrollAmount;

      // Reset to beginning for infinite loop
      if (container.scrollLeft >= container.scrollWidth / 2) {
        scrollAmount = 0;
        container.scrollLeft = 0;
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isAutoScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const scrollAmount = 250;
    if (direction === "left") {
      containerRef.current.scrollLeft -= scrollAmount;
    } else {
      containerRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg border-2 border-[#0f2f63] text-[#0f2f63] hover:bg-[#0f2f63] hover:text-white transition-all hover:scale-110 -ml-6"
      >
        ←
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg border-2 border-[#0f2f63] text-[#0f2f63] hover:bg-[#0f2f63] hover:text-white transition-all hover:scale-110 -mr-6"
      >
        →
      </button>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2 px-4"
        onMouseEnter={() => setIsAutoScroll(false)}
        onMouseLeave={() => setIsAutoScroll(true)}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayItems.map((item, idx) => (
          <Link
            key={`${item.id}-${idx}`}
            href={`/item/${item.id}`}
            className="group relative flex-shrink-0 w-56 rounded-2xl bg-white overflow-hidden transition-all hover:-translate-y-2"
            style={{ boxShadow: "0 5px 15px rgba(0,0,0,0.08)" }}
          >
            {/* Badge */}
            <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#ff3b6d] to-[#ff6b95] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
              PREORDER
            </div>

            {/* Image */}
            <div className="relative h-56 bg-zinc-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 group-hover:text-[#0f2f63] transition-colors">
                {item.title}
              </h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold text-[#ff3b6d]">
                  {item.price.formatted}
                </span>
                {item.original_price && (
                  <span className="text-xs text-zinc-500 line-through">
                    ${item.original_price}
                  </span>
                )}
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-[#0f2f63] to-[#1a3f7a] hover:from-[#1a3f7a] hover:to-[#0f2f63] text-white font-semibold py-2 rounded-lg transition-all shadow-md hover:shadow-lg relative overflow-hidden group/btn">
                <span className="relative z-10">Shop Now</span>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
