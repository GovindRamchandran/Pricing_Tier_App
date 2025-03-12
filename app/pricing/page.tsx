'use client';

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/utils/fetcher';
import { useAuth } from '../components/AuthProvider';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import SwiperCore from 'swiper';
import { EffectCoverflow, Navigation } from 'swiper/modules';

SwiperCore.use([EffectCoverflow, Navigation]);

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PricingPage() {
  const { data: tiers, error, isLoading } = useSWR('/api/pricing', fetcher);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingTier, setLoadingTier] = useState(true);
  const [featureIndex, setFeatureIndex] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    const fetchTier = async () => {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const tier = userSnap.data()?.tier;
        setUserTier(tier || null);
        setSelectedTier(tier || null);
      }
      setLoadingTier(false);
    };

    fetchTier();
  }, [user]);

  const handleSaveTier = async () => {
    if (!user || !selectedTier) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { tier: selectedTier }, { merge: true });
    setUserTier(selectedTier);
    setIsEditMode(false);
  };

  if (error) return <div className="text-red-500">Error loading pricing data</div>;
  if (isLoading || loadingTier) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading pricing plans...
      </div>
    );
  }

  if (userTier && !isEditMode) {
    const currentTierDetails = tiers.find((t: any) => t.name === userTier);
    const features = currentTierDetails?.features || [];

    return (
      <main className="relative flex items-center justify-center min-h-screen flex-col p-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-[#0E4259] via-[#1C586F] to-[#0E4259] opacity-40 blur-3xl" />

        <h1 className="text-4xl font-bold mb-6 text-black dark:text-white drop-shadow-lg">
          Your Subscription
        </h1>

        <div className="inline-block bg-[#0E4259] dark:bg-gray-700 text-white dark:text-white px-6 py-4 rounded shadow mb-6">
          <p>
            <span className="text-xl font-semibold">Current Plan:</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-xl font-bold text-amber-500">{userTier}</span>
          </p>
        </div>

        {/* ✅ Replacing Feature Panel with Swiper 3D Carousel */}
        {features.length > 0 && (
          <div className="relative w-full max-w-3xl"> {/* 💥 Increased width */}
            <Swiper
              modules={[EffectCoverflow, Navigation]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={1.5} // Slightly wider visual
              loop={true}
              speed={700}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 120,
                modifier: 1.5,
                slideShadows: true,
              }}
              className="w-full py-10" // 💥 Taller swiper
            >
              {features.map((feature: any, idx: any) => (
                <SwiperSlide key={idx}>
                  <div className="bg-white/30 dark:bg-gray-700/60 text-black dark:text-white p-8 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-500 min-h-[280px] flex items-center justify-center text-center text-2xl font-semibold">
                    {feature}
                  </div>
                </SwiperSlide>
              ))}

              {/* Navigation arrows (container stays same, icon gets smaller) */}
              <div className="swiper-button-prev custom-swiper-button">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" stroke="black" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="swiper-button-next custom-swiper-button">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M9 6l6 6-6 6" stroke="black" strokeWidth="2" fill="none" />
                </svg>
              </div>

            </Swiper>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => setIsEditMode(true)}
            className="px-4 py-2 mt-4 bg-[#0E4259] text-white rounded shadow-lg hover:bg-[#1d8fc2] hover:translate-y-[-1px] active:translate-y-[1px] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Change Plan
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="relative p-8 flex min-h-screen flex-col text-center overflow-hidden">
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-[#0E4259] via-[#1C586F] to-[#0E4259] opacity-40 blur-3xl" />
      <h1 className="text-4xl font-bold mb-4 text-center text-black dark:text-white">
        Select Your Plan
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`px-4 py-2 border rounded-[6px] cursor-pointer active:scale-95 transition-all ${billingCycle === 'monthly' ? 'bg-[#0E4259] text-white' : 'bg-gray-200'
            }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle('yearly')}
          className={`px-4 py-2 border rounded-[6px] cursor-pointer active:scale-95 transition-all ${billingCycle === 'yearly' ? 'bg-[#0E4259] text-white' : 'bg-gray-200'
            }`}
        >
          Yearly
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {tiers.map((tier: any) => {
          const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
          const isSelected = selectedTier === tier.name;

          return (
            <div
              key={tier.name}
              onClick={() => setSelectedTier(tier.name)}
              className={`cursor-pointer dark:bg-gray-600 border p-6 rounded-lg shadow text-black dark:text-white transition-all ${isSelected
                ? 'border-4 border-[#0E4259] dark:border-gray-200 scale-[1.02]'
                : 'border-gray-300 dark:border-gray-600'
                }`}
            >
              <h2 className="text-2xl font-semibold mb-2 text-center">{tier.name}</h2>
              <p className="text-3xl font-bold text-center mb-4">${price}</p>
              <ul className="space-y-2">
                {tier.features.map((feature: string) => (
                  <li key={feature} className="text-md text-gray-700 dark:text-white">
                    • {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSaveTier}
          disabled={!selectedTier}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 active:scale-95 transition disabled:opacity-50 cursor-pointer"
        >
          Confirm and Save Selection
        </button>
      </div>
    </main>
  );
}
