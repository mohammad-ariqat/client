"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import type { HeroSlide, Locale } from "../../lib"

interface HeroSectionProps {
    currentLocale: Locale
}

export default function HeroSection({ currentLocale }: HeroSectionProps) {
    const t = useTranslations()
    const [currentSlide, setCurrentSlide] = useState(0)

    const heroSlides: HeroSlide[] = useMemo(() => [
        {
            image:
                "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            subtitle: t("hero.slide1.subtitle"),
            title: t("hero.slide1.title"),
            description: t("hero.slide1.description"),
        },
        {
            image:
                "https://images.unsplash.com/photo-1535379453347-1ffd615e2e08?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            subtitle: t("hero.slide2.subtitle"),
            title: t("hero.slide2.title"),
            description: t("hero.slide2.description"),
        },
        {
            image:
                "https://images.unsplash.com/photo-1627920769541-daa658ed6b59?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            subtitle: t("hero.slide3.subtitle"),
            title: t("hero.slide3.title"),
            description: t("hero.slide3.description"),
        },
    ], [t])

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, [heroSlides.length])

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000)
        return () => clearInterval(timer)
    }, [nextSlide])

    // Preload images for smoother transitions
    useEffect(() => {
        heroSlides.forEach((slide) => {
            const img = new Image()
            img.src = slide.image
        })
    }, [heroSlides])

    // Optimized animation variants
    const contentVariants = {
        hidden: { 
            opacity: 0, 
            y: 20,
            transition: { duration: 0.2 }
        },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.3,
                ease: "easeOut"
            }
        }
    }

    const currentSlideData = heroSlides[currentSlide]

    return (
        <section className="relative h-[90vh] w-full overflow-hidden" dir={currentLocale === "ar" ? "rtl" : "ltr"}>
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            
            {/* Background images with CSS transitions for better performance */}
            {heroSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                        backgroundImage: `url('${slide.image}')`,
                        transform: 'translateZ(0)', // Force hardware acceleration
                        willChange: 'opacity'
                    }}
                />
            ))}

            {/* Content with reduced animation complexity */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    className="relative z-20 h-full flex flex-col items-center justify-center text-white px-4 text-center"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <h3 className="text-2xl font-light mb-2">{currentSlideData.subtitle}</h3>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl">{currentSlideData.title}</h1>
                    <p className="text-xl max-w-2xl opacity-90">{currentSlideData.description}</p>

                    <div className="mt-10 flex gap-4">
                        <Link href={`/${currentLocale}/products`}>
                            <button className="bg-[#337a5b] hover:bg-[#0f4229] text-white px-8 py-3 rounded-full transition-colors md:flex hidden">
                                {t("home.shopNow")}
                            </button>
                        </Link>
                        <Link href={`/${currentLocale}/services`}>
                            <button className="md:flex hidden bg-[#a9f59d] hover:bg-[#8ed67d] text-[#0f4229] px-8 py-3 rounded-full transition-colors">
                                {t("home.requestService")}
                            </button>
                        </Link>
                        <Link href={`/${currentLocale}/about-us`}>
                            <button className="md:flex hidden border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-[#0f4229] transition-colors">
                                {t("home.learnMore")}
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                            currentSlide === index ? "bg-white" : "bg-white/50"
                        }`}
                        style={{ transform: 'translateZ(0)' }} // Force hardware acceleration
                    />
                ))}
            </div>
        </section>
    )
}