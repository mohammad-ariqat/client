'use client';

import { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import CategoryCarousel from './category-carousel';
import type { Category, Locale } from '../../lib';

interface CategoriesSectionProps {
  currentLocale: Locale;
}

export default function CategoriesSection({ currentLocale }: CategoriesSectionProps) {
  const t = useTranslations();
  const categoriesRef = useRef(null);
  const categoriesInView = useInView(categoriesRef, { 
    once: true, 
    margin: '-50px', // Reduced margin for earlier trigger
    amount: 0.1 // Trigger when 10% is visible
  });

  // Memoize categories to prevent recreation on every render
  const categories: Category[] = useMemo(() => [
    {
      id: 1, // Use static IDs instead of Math.random()
      name: { en: 'Plants', ar: 'نباتات' },
      subcategories: [],
      image: '/5.svg',
    },
    {
      id: 2,
      name: { en: 'Seeds', ar: 'بذور' },
      subcategories: [],
      image: '/4.svg',
    },
    {
      id: 3,
      name: { en: 'Pesticides', ar: 'مبيدات' },
      subcategories: [],
      image: '/6.svg',
    },
    {
      id: 4,
      name: { en: 'Fertilizers', ar: 'أسمدة' },
      subcategories: [],
      image: '/7.svg',
    },
    {
      id: 5,
      name: { en: 'Agricultural Equipment', ar: 'مستلزمات زراعية' },
      subcategories: [],
      image: '/10.svg',
    },
  ], []);

  // Optimized animation variants with reduced complexity
  const categoriesVariants = useMemo(() => ({
    initial: { 
      opacity: 0, 
      y: 30, // Reduced from 50px
      transition: { duration: 0.2 }
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4, // Reduced from 0.6s
        ease: 'easeOut',
        staggerChildren: 0.1
      } 
    },
  }), []);

  return (
    <motion.section
      ref={categoriesRef}
      className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 my-8 rounded-3xl bg-gradient-to-br from-[var(--primary-bg)] to-[rgba(51,122,91,0.1)] border border-[rgba(51,122,91,0.3)] shadow-xl relative overflow-hidden"
      initial="initial"
      animate={categoriesInView ? 'animate' : 'initial'}
      variants={categoriesVariants}
      dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      style={{
        transform: 'translateZ(0)', // Force hardware acceleration
        willChange: categoriesInView ? 'auto' : 'transform, opacity'
      }}
    >
      {/* Optimized background with hardware acceleration */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-no-repeat bg-cover"
        style={{ 
          backgroundImage: "url('/bg1.svg')",
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden' // Prevent flickering
        }}
      />

      <motion.h2 
        className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--accent-color)] mb-8 relative"
        variants={{
          initial: { opacity: 0, y: 20 },
          animate: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.3, ease: 'easeOut' }
          }
        }}
      >
        {t('categories.categories')}
        <span className="absolute" />
      </motion.h2>
      
      <motion.div 
        className="relative overflow-hidden"
        variants={{
          initial: { opacity: 0 },
          animate: { 
            opacity: 1, 
            transition: { duration: 0.3, delay: 0.1 }
          }
        }}
        style={{
          transform: 'translateZ(0)', // Hardware acceleration for carousel container
        }}
      >
        <CategoryCarousel categories={categories} currentLocale={currentLocale} />
      </motion.div>
    </motion.section>
  );
}