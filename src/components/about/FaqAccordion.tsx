'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Button } from '@/components/ui/Button';

export interface FAQItem {
  category: 'Orders' | 'Delivery' | 'Payments' | 'Tracking';
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
}

export const FAQS: FAQItem[] = [
  {
    category: 'Orders',
    questionBn: 'অর্ডার করতে কি অ্যাকাউন্ট খোলা বা রেজিস্ট্রেশন বাধ্যতামূলক?',
    questionEn: 'Is account registration mandatory to place an order?',
    answerBn:
      'না! ShopNexus-এ কোনো রেজিস্ট্রেশন বা পাসওয়ার্ডের ঝামেলা ছাড়াই আপনি শুধু আপনার নাম, মোবাইল নম্বর এবং ডেলিভারি ঠিকানা দিয়ে সরাসরি ১-ক্লিকে "Guest Checkout" বা ডিরেক্ট অর্ডার করতে পারবেন।',
    answerEn:
      'No! You can order directly on ShopNexus with 1-Click Guest Checkout using only your name, phone number, and delivery address—no passwords required.',
  },
  {
    category: 'Delivery',
    questionBn: 'ডেলিভারি চার্জ কত এবং কত দ্রুত ডেলিভারি পাওয়া যাবে?',
    questionEn: 'What are the delivery charges and shipping times?',
    answerBn:
      'ঢাকা শহরের ভেতরে ডেলিভারি চার্জ মাত্র ৳৬০ এবং ২৪-৪৮ ঘণ্টার মধ্যে পাঠাও এক্সপ্রেসের মাধ্যমে ডেলিভারি করা হয়। ঢাকার বাইরে সমগ্র বাংলাদেশে ডেলিভারি চার্জ মাত্র ৳১২০ এবং ৪৮-৭২ ঘণ্টার মধ্যে স্টিডফাস্ট কুরিয়ারের মাধ্যমে পৌঁছে দেওয়া হয়।',
    answerEn:
      'Delivery charge is ৳60 inside Dhaka (24-48 hours via Pathao Express), and ৳120 across all Bangladesh (48-72 hours via Steadfast Logistics).',
  },
  {
    category: 'Tracking',
    questionBn: 'লগইন না করে আমি কীভাবে আমার অর্ডারের পার্সেল ট্র্যাক করব?',
    questionEn: 'How can I track my parcel without logging in?',
    answerBn:
      'অর্ডার কনফার্ম করার পর আপনার মোবাইলে তাৎক্ষণিক SMS-এর মাধ্যমে একটি ট্র্যাকিং নম্বর (যেমন: TRK-NX-88219) চলে যাবে। আপনি সরাসরি আমাদের ডেডিকেটেড ট্র্যাকিং পোর্টালে (/track) গিয়ে শুধু আপনার অর্ডার নম্বর বা ট্র্যাকিং কোড দিলেই লাইভ স্ট্যাটাস দেখতে পাবেন।',
    answerEn:
      'After confirming an order, you will receive an SMS with your tracking code (e.g., TRK-NX-88219). You can track live courier status directly on our tracking portal (/track) using this code.',
  },
  {
    category: 'Payments',
    questionBn: 'পেমেন্ট করার জন্য কী কী মাধ্যম রয়েছে?',
    questionEn: 'What payment options are available?',
    answerBn:
      'আপনি ক্যাশ অন ডেলিভারি (Cash on Delivery / পণ্য হাতে পেয়ে টাকা পরিশোধ), বিকাশ (bKash Instant Gateway), নগদ (Nagad Instant Gateway) অথবা যেকোনো আন্তর্জাতিক ডেবিট/ক্রেডিট কার্ডের মাধ্যমে নিরাপদে পেমেন্ট করতে পারবেন।',
    answerEn:
      'We support Cash on Delivery (COD), bKash Instant Payment, Nagad Instant Gateway, and Visa/Mastercard/Amex debit and credit cards.',
  },
  {
    category: 'Orders',
    questionBn: 'স্মার্ট প্রোডাক্ট বান্ডেল (Frequently Bought Together) কী এবং কীভাবে ছাড় পাব?',
    questionEn: 'What are Smart Bundles and how do I get the discount?',
    answerBn:
      'যেকোনো গ্যাজেট কেনার সময় তার প্রয়োজনীয় এক্সেসরিজ একসাথে বান্ডেল হিসেবে কিনলে স্বয়ংক্রিয়ভাবে ১৫% অতিরিক্ত ফ্ল্যাট ডিসকাউন্ট পাওয়া যায়। ১-ক্লিকেই ৩টি আইটেম কার্টে অ্যাড করা যায়।',
    answerEn:
      'Smart Bundles let you add complementary accessories with an automatic 15% flat bundle discount in a single click.',
  },
  {
    category: 'Payments',
    questionBn: 'প্রোডাক্ট ডিফেক্টিভ হলে রিটার্ন ও রিফান্ড পলিসি কী?',
    questionEn: 'What is the return and refund policy for defective goods?',
    answerBn:
      'আমাদের প্ল্যাটফর্মের প্রতিটি প্রোডাক্ট ১০০% অফিশিয়াল ও ভেরিফাইড। পণ্য পাওয়ার পর কোনো সমস্যা দেখা দিলে ৭ দিনের মধ্যে ফ্রি রিপ্লেসমেন্ট এবং ১০০% রিফান্ড গ্যারান্টি রয়েছে।',
    answerEn:
      'Every product is 100% verified genuine. We offer a 7-day hassle-free replacement and full money-back guarantee.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { language } = useLanguageStore();

  const categories = ['All', 'Orders', 'Delivery', 'Payments', 'Tracking'];

  const filteredFaqs =
    activeCategory === 'All'
      ? FAQS
      : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveCategory(cat);
              setOpenIndex(null);
            }}
            className="rounded-full"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const question = language === 'bn' ? faq.questionBn : faq.questionEn;
          const answer = language === 'bn' ? faq.answerBn : faq.answerEn;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    {question}
                  </span>
                </div>
                <div className="text-slate-400 shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                  {answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
