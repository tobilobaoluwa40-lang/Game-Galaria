import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { useShop } from '@/context/shop-context';
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  ChevronRight,
  Cpu,
  Gamepad2,
  Headphones,
  Keyboard,
  MonitorPlay,
  Pause,
  Play,
  Zap,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

const heroSlides = [
  {
    eyebrow: 'Console season is here',
    title: 'Your next great session starts now.',
    description: 'Bring home the hardware, games, and accessories that make every round feel better.',
    image: `${basePath}/hero-console.jpg`,
    alt: 'Premium gaming console and controller on a desk',
    primaryLabel: 'Shop consoles',
    primaryHref: '/shop/consoles',
    secondaryLabel: 'View all gear',
    secondaryHref: '/shop',
  },
  {
    eyebrow: 'Build your battlestation',
    title: 'Make your setup unmistakably yours.',
    description: 'Curated keyboards, headsets, and PC essentials for focused play and long nights.',
    image: `${basePath}/hero-pc-setup.jpg`,
    alt: 'Gaming PC setup with keyboard and headset',
    primaryLabel: 'Explore accessories',
    primaryHref: '/shop/accessories',
    secondaryLabel: 'Shop PC parts',
    secondaryHref: '/shop/gaming-pcs',
  },
  {
    eyebrow: 'Play wherever you are',
    title: 'Take the adventure with you.',
    description: 'Discover compact, powerful gaming favorites made for the commute, couch, and everywhere between.',
    image: `${basePath}/hero-handheld.jpg`,
    alt: 'Handheld gaming console on a desk',
    primaryLabel: 'Shop handhelds',
    primaryHref: '/shop/consoles',
    secondaryLabel: 'Browse new arrivals',
    secondaryHref: '/shop',
  },
];

const promoSlides = [
  {
    eyebrow: 'Limited-time offer',
    title: 'Get 20% off next-gen titles',
    description: 'Level up your game library with discounts on blockbuster titles for PS5 and Xbox Series X.',
    image: `${basePath}/hero-console.jpg`,
    alt: 'PlayStation console and controller',
    action: 'Claim deal',
    href: '/shop?badge=Deal',
    icon: BadgePercent,
  },
  {
    eyebrow: 'Build your battlestation',
    title: 'Save on the gear that makes the setup',
    description: 'Upgrade your desk with curated keyboards, headsets, and essentials made for longer sessions.',
    image: `${basePath}/hero-pc-setup.jpg`,
    alt: 'Gaming PC setup with keyboard and headset',
    action: 'Shop accessories',
    href: '/shop/accessories',
    icon: Keyboard,
  },
  {
    eyebrow: 'Play beyond the couch',
    title: 'Take your next adventure anywhere',
    description: 'Find portable favorites and everyday gaming essentials with fast delivery across Nigeria.',
    image: `${basePath}/hero-handheld.jpg`,
    alt: 'Handheld gaming console ready for play',
    action: 'Explore handhelds',
    href: '/shop/consoles',
    icon: Gamepad2,
  },
];

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${className}`}
      data-revealed={revealed}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const slide = heroSlides[activeSlide];
  const goTo = (index: number) => setActiveSlide((index + heroSlides.length) % heroSlides.length);

  return (
    <section
      className="relative min-h-[620px] overflow-hidden border-b border-border sm:min-h-[680px]"
      aria-roledescription="carousel"
      aria-label="Featured gaming gear"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsPaused(false);
      }}
    >
      {heroSlides.map((item, index) => (
        <div
          key={item.image}
          className={`absolute inset-0 transition-opacity duration-700 ${index === activeSlide ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          aria-hidden={index !== activeSlide}
        >
          <img
            src={item.image}
            alt={item.alt}
            className="h-full w-full object-cover object-center"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#1A2525_0%,rgba(26,37,37,.94)_28%,rgba(26,37,37,.56)_56%,rgba(26,37,37,.2)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A2525] via-transparent to-[#1A2525]/30" />

      <div className="container relative z-10 mx-auto flex min-h-[620px] items-center px-4 py-24 sm:min-h-[680px] md:py-32">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-[10px] border border-[#838C6D]/45 bg-[#1E2A26]/70 px-3 py-1.5 text-sm font-medium text-[#C2C7AC] backdrop-blur-md">
            <Zap className="h-4 w-4 text-[#959372]" />
            {slide.eyebrow}
          </div>
          <h1 className="max-w-xl text-5xl font-extrabold leading-[1.05] tracking-tight text-[#C2C7AC] md:text-7xl">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#C2C7AC]/80">{slide.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={slide.primaryHref}>
              <Button size="lg" className="h-12 px-8 text-base font-bold shadow-lg">
                {slide.primaryLabel}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={slide.secondaryHref}>
              <Button size="lg" variant="outline" className="h-12 border-[#C2C7AC]/30 bg-[#1A2525]/35 px-8 text-base font-bold text-[#C2C7AC] backdrop-blur-md hover:bg-[#323D39]/80">
                {slide.secondaryLabel}
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-[#C2C7AC]/70">
            <span>New to Game Galaria?</span>
            <Link href="/register" className="font-semibold text-[#C2C7AC] underline-offset-4 hover:text-[#959372] hover:underline">Create your account</Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-0 right-0 z-10">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose featured slide">
            {heroSlides.map((item, index) => (
              <button
                key={item.image}
                type="button"
                role="tab"
                aria-selected={index === activeSlide}
                aria-label={`Show slide ${index + 1}: ${item.eyebrow}`}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === activeSlide ? 'w-10 bg-[#C2C7AC]' : 'w-2 bg-[#C2C7AC]/45 hover:bg-[#C2C7AC]/75'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#C2C7AC]/25 bg-[#1A2525]/65 text-[#C2C7AC] backdrop-blur-md transition-colors hover:bg-[#323D39]"
              onClick={() => goTo(activeSlide - 1)}
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#C2C7AC]/25 bg-[#1A2525]/65 text-[#C2C7AC] backdrop-blur-md transition-colors hover:bg-[#323D39]"
              onClick={() => setIsPaused((paused) => !paused)}
              aria-label={isPaused ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation'}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#C2C7AC]/25 bg-[#1A2525]/65 text-[#C2C7AC] backdrop-blur-md transition-colors hover:bg-[#323D39]"
              onClick={() => goTo(activeSlide + 1)}
              aria-label="Next slide"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PromoCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % promoSlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const goTo = (index: number) => setActiveSlide((index + promoSlides.length) % promoSlides.length);
  const slide = promoSlides[activeSlide];
  const SlideIcon = slide.icon;

  return (
    <section
      className="relative overflow-hidden rounded-[10px] border border-[#53624D] bg-[#1B2926] shadow-[0_24px_70px_rgba(20,35,31,.24)]"
      aria-roledescription="carousel"
      aria-label="Special offers"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsPaused(false);
      }}
    >
      <div className="relative min-h-[360px] sm:min-h-[310px]">
        {promoSlides.map((item, index) => (
          <div
            key={item.title}
            className={`absolute inset-0 transition-opacity duration-700 ${index === activeSlide ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            aria-hidden={index !== activeSlide}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(131,140,109,.16),transparent_34%),linear-gradient(105deg,#1B2926_0%,#1E302B_54%,#1B2926_100%)]" />
            <div className="container relative mx-auto flex h-full items-center px-6 py-12 sm:px-10 lg:px-12">
              <div className="relative z-10 max-w-[600px]">
                <div className="mb-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#AAB18E]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#879374]/50 bg-[#263A31]">
                    <SlideIcon className="h-4 w-4" />
                  </span>
                  {item.eyebrow}
                </div>
                <h2 className="max-w-xl text-3xl font-extrabold leading-[1.08] tracking-tight text-[#D2D5BB] sm:text-4xl lg:text-[2.65rem]">
                  {item.title}
                </h2>
                <p className="mt-4 max-w-[520px] text-sm leading-6 text-[#AAB18E]/85 sm:text-base">
                  {item.description}
                </p>
                <Link href={item.href} className="mt-7 inline-flex">
                  <Button className="h-11 bg-[#AAB18E] px-6 font-bold text-[#1B2926] shadow-[0_8px_22px_rgba(170,177,142,.16)] hover:bg-[#C2C7AC]">
                    {item.action}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="absolute right-6 top-1/2 hidden h-[210px] w-[34%] -translate-y-1/2 rotate-[2deg] overflow-hidden rounded-[10px] border border-[#61705B]/60 bg-[#263A31]/60 shadow-[0_12px_30px_rgba(6,16,13,.18)] sm:block lg:right-12 lg:h-[225px]">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="h-full w-full object-cover opacity-50 mix-blend-luminosity transition-transform duration-700"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#263A31]/85 via-[#263A31]/40 to-[#1B2926]/80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#AAB18E]/45 bg-[#1B2926]/40 text-[#AAB18E] backdrop-blur-sm">
                    <SlideIcon className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-6 right-6 z-20 flex items-center justify-between sm:left-10 sm:right-10">
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose special offer">
          {promoSlides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={index === activeSlide}
              aria-label={`Show offer ${index + 1}: ${item.title}`}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === activeSlide ? 'w-8 bg-[#C2C7AC]' : 'w-1.5 bg-[#AAB18E]/45 hover:bg-[#AAB18E]/80'}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#AAB18E]/25 bg-[#1B2926]/65 text-[#C2C7AC] transition-colors hover:bg-[#304239]"
            onClick={() => goTo(activeSlide - 1)}
            aria-label="Previous offer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#AAB18E]/25 bg-[#1B2926]/65 text-[#C2C7AC] transition-colors hover:bg-[#304239]"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? 'Resume automatic offer rotation' : 'Pause automatic offer rotation'}
          >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#AAB18E]/25 bg-[#1B2926]/65 text-[#C2C7AC] transition-colors hover:bg-[#304239]"
            onClick={() => goTo(activeSlide + 1)}
            aria-label="Next offer"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { products } = useShop();
  const newArrivals = products.filter((p) => p.badge === 'New Arrival' || p.badge === 'Top Selling').slice(0, 4);
  const featured = products.filter((p) => p.badge === 'Featured' || p.badge === 'Deal' || p.badge === 'Limited-Time Deal').slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />

        <Reveal>
          <section className="border-b border-border bg-card/30 py-20">
            <div className="container mx-auto px-4">
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <h2 className="mb-2 text-3xl font-bold tracking-tight">Browse by Category</h2>
                  <p className="text-muted-foreground">Find exactly what you need for your setup</p>
                </div>
                <Link href="/shop" className="hidden items-center text-primary hover:text-primary/80 sm:flex">
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {[
                   { name: 'Consoles', slug: 'consoles', icon: Gamepad2, count: 24 },
                   { name: 'Video Games', slug: 'video-games', icon: MonitorPlay, count: 156 },
                   { name: 'Accessories', slug: 'accessories', icon: Keyboard, count: 89 },
                   { name: 'Headsets', slug: 'headsets', icon: Headphones, count: 42 },
                   { name: 'Gaming PCs', slug: 'gaming-pcs', icon: Cpu, count: 112 },
                ].map((category, index) => (
                  <Reveal key={category.name} delay={index * 70}>
                    <Link
                      href={`/shop/${category.slug}`}
                      className="group flex h-full flex-col items-center justify-center rounded-[10px] border border-border bg-card p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/10 hover:shadow-xl"
                    >
                      <category.icon className="mb-4 h-10 w-10 text-muted-foreground transition-colors group-hover:text-primary" />
                      <span className="mb-1 text-lg font-bold">{category.name}</span>
                      <span className="text-xs text-muted-foreground">{category.count} items</span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="mb-10">
                <h2 className="mb-2 text-3xl font-bold tracking-tight">Trending now</h2>
                <p className="text-muted-foreground">Top selling and most wanted gear</p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {newArrivals.map((product, index) => (
                  <Reveal key={product.id} delay={index * 80}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="py-10">
            <div className="container mx-auto px-4">
              <PromoCarousel />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="mb-10 text-3xl font-bold tracking-tight">New arrivals</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((product, index) => (
                  <Reveal key={product.id} delay={index * 80}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}