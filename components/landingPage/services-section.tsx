'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { fetchServices } from '../../lib/api';

interface Service {
  id: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image: string;
}

interface ServicesSectionProps {
  currentLocale: 'en' | 'ar';
}

export default function ServicesSection({ currentLocale }: ServicesSectionProps) {
  const t = useTranslations();
  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: '-50px', amount: 0.1 });
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mockServicesData: Service[] = useMemo(() => [
    {
      id: 1,
      name_en: 'Tree and Plant Care',
      name_ar: 'العناية بالأشجار والنباتات',
      description_en: 'Full care services for trees and plants to help them grow healthy and beautiful.',
      description_ar: 'خدمات متكاملة للعناية بالأشجار والنباتات لضمان نموها بشكل صحي وجميل.',
      image: '/agri services.jpg',
    },
    {
      id: 2,
      name_en: 'Agricultural Consultations',
      name_ar: 'الاستشارات الزراعية',
      description_en: 'Expert advice from agricultural engineers to improve plant care.',
      description_ar: 'توجيهات ونصائح مهنية من مهندسين زراعيين مختصين لتحسين العناية بالنباتات.',
      image: '/educational content.webp',
    },
    {
      id: 3,
      name_en: 'Garden Landscaping',
      name_ar: 'تنسيق الحدائق',
      description_en: 'Designing and organizing small gardens with high quality to improve their look and use space wisely.',
      description_ar: 'تصميم وتنظيم الحدائق الصغيرة بأعلى جودة لتحسين مظهرها واستخدام المساحات بشكل فعال.',
      image: '/best plants.jpg',
    },
  ], []);

  const servicesVariants = useMemo(() => ({
    initial: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.2 }
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3, 
        ease: 'easeOut',
        staggerChildren: 0.1
      },
    },
  }), []);

  const cardVariants = useMemo(() => ({
    initial: { opacity: 0, y: 15 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }), []);

  const trimDescription = useCallback((description: string) => {
    const maxLength = 150;
    return description.length > maxLength ? `${description.slice(0, maxLength - 3)}...` : description;
  }, []);

  const loadServices = useCallback(async () => {
    if (servicesData.length > 0) return;
    
    try {
      setIsLoading(true);
      const services = await fetchServices();
      setServicesData(services.slice(0, 3).length ? services.slice(0, 3) : mockServicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServicesData(mockServicesData.slice(0, 3));
    } finally {
      setIsLoading(false);
    }
  }, [servicesData.length, mockServicesData]);

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <motion.section
      ref={servicesRef}
      className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10 my-10 rounded-3xl bg-gradient-to-tr from-[var(--primary-bg)] to-[rgba(34,139,34,0.15)] border border-[rgba(34,139,34,0.3)] shadow-xl relative overflow-hidden"
      initial="initial"
      animate={servicesInView ? 'animate' : 'initial'}
      variants={servicesVariants}
      dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      style={{
        transform: 'translateZ(0)',
        willChange: servicesInView ? 'auto' : 'transform, opacity'
      }}
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none bg-no-repeat bg-cover"
        style={{ 
          backgroundImage: "url('/bg3.svg')",
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />

      <motion.h2 
        className="text-center text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--accent-color)] mb-8 relative"
        variants={cardVariants}
      >
        {t('header.services')}
        <span 
          className="absolute inset-0 -z-10 bg-[var(--accent-color)] opacity-10 rounded-full filter blur-xl"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        />
      </motion.h2>

      <motion.div 
        className='text-center mb-4 relative'
        variants={cardVariants}
      >
        <h3 className="text-2xl font-medium text-[var(--accent-color)] mb-4">
          {t('home.choosePlantsDescription')}
        </h3>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-color)]"></div>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={cardVariants}
        >
          {servicesData.map((service) => (
            <Link href={`/${currentLocale}/services/${service.id}`} key={service.id} className='relative'>
              <motion.div
                className={`rounded-xl p-6 flex flex-col items-center h-full transition-colors duration-300 ${
                  service.id === 2 ? 'bg-[var(--accent-color)] text-white' : 'bg-white'
                }`}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                  transition: { duration: 0.2 }
                }}
                style={{ transform: 'translateZ(0)' }}
              >
                <Image
                  src={service.image ? `${process.env.NEXT_PUBLIC_API_URL}${service.image}` : '/placeholder.svg'}
                  alt={currentLocale === 'ar' ? service.name_ar : service.name_en}
                  width={400}
                  height={300}
                  className="w-full h-56 object-cover mb-4"
                  loading="lazy"
                />
                <h4
                  className={`text-xl font-medium mb-3 ${
                    service.id === 2 ? '' : 'text-[var(--accent-color)]'
                  }`}
                >
                  {currentLocale === 'ar' ? service.name_ar : service.name_en}
                </h4>
                <p className={`text-center flex-1 ${service.id === 2 ? '' : 'text-gray-700'}`}>
                  {trimDescription(currentLocale === 'ar' ? service.description_ar : service.description_en)}
                </p>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}

      <motion.div 
        className="text-center mt-6"
        variants={cardVariants}
      >
        <Link href={`/${currentLocale}/services`} className="inline-block">
          <button 
            className="px-6 py-3 bg-[var(--accent-color)] text-white font-medium rounded-full shadow-md transition-transform duration-200 hover:scale-102"
            style={{ transform: 'translateZ(0)' }}
          >
            {t('home.viewMore')}
          </button>
        </Link>
      </motion.div>
    </motion.section>
  );
}