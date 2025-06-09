'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ProductCarousel from './product-carousel';
import { fetchTopProducts } from '../../lib/api';
import type { Product, Locale } from '../../lib';

interface TopSellersSectionProps {
  currentLocale: Locale;
}

export default function TopSellersSection({ currentLocale }: TopSellersSectionProps) {
  const t = useTranslations();
  const topSellersRef = useRef(null);
  const topSellersInView = useInView(topSellersRef, { 
    once: true, 
    margin: '-50px', // Reduced margin for earlier trigger
    amount: 0.1 // Trigger when 10% is visible
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized animation variants with reduced complexity
  const topSellersVariants = useMemo(() => ({
    initial: { 
      opacity: 0, 
      y: 20, // Reduced from 30px
      transition: { duration: 0.2 }
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3, // Reduced duration
        ease: 'easeOut',
        staggerChildren: 0.1
      },
    },
  }), []);

  // Memoized title animation variants
  const titleVariants = useMemo(() => ({
    initial: { 
      opacity: 0, 
      y: 15,
      transition: { duration: 0.2 }
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        ease: 'easeOut' 
      }
    }
  }), []);

  // Memoized carousel animation variants
  const carouselVariants = useMemo(() => ({
    initial: { 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        delay: 0.1 
      }
    }
  }), []);

  // Memoized load products function
  const loadProducts = useCallback(async () => {
    if (products.length > 0) return; // Prevent refetching if already loaded
    
    try {
      setIsLoading(true);
      const topProducts = await fetchTopProducts();
      setProducts(topProducts);
    } catch (err) {
      console.error('Error fetching top products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [products.length]);

  useEffect(() => {
    loadProducts();
  }, []); // Removed t dependency to prevent unnecessary refetches

  return (
    <motion.section
      ref={topSellersRef}
      className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 my-10 rounded-3xl bg-gradient-to-tr from-[var(--primary-bg)] to-[rgba(34,139,34,0.15)] border border-[rgba(34,139,34,0.3)] shadow-xl relative overflow-hidden"
      initial="initial"
      animate={topSellersInView ? 'animate' : 'initial'}
      variants={topSellersVariants}
      dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      style={{
        transform: 'translateZ(0)', // Force hardware acceleration
        willChange: topSellersInView ? 'auto' : 'transform, opacity'
      }}
    >
      {/* Optimized background with hardware acceleration */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-no-repeat bg-cover"
        style={{ 
          backgroundImage: "url('/bg2.svg')",
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden' // Prevent flickering
        }}
      />

      <motion.h2 
        className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent-color)] mb-0 relative"
        variants={titleVariants}
      >
        {t('home.topSellers')}
        <span 
          className="absolute inset-0 -z-10 bg-[var(--accent-color)] opacity-10 rounded-full filter blur-xl"
          style={{
            transform: 'translateZ(0)', // Hardware acceleration for blur effect
            backfaceVisibility: 'hidden'
          }}
        />
      </motion.h2>

      <motion.div
        variants={carouselVariants}
        style={{
          transform: 'translateZ(0)', // Hardware acceleration for carousel container
        }}
      >
        {/* Show loading state or carousel */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-color)]"></div>
          </div>
        ) : (
          <ProductCarousel 
            products={products} 
            currentLocale={currentLocale} 
            pageName="home" 
          />
        )}
      </motion.div>
    </motion.section>
  );
}