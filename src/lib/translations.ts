export type Language = 'en' | 'bn';

export const TRANSLATIONS = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_products: 'Products',
    nav_flash_deals: 'Flash Deals',
    nav_search_placeholder: 'Search products, brands, audio gear...',
    nav_cart: 'Cart',
    nav_wishlist: 'Wishlist',
    nav_notifications: 'Notifications',
    nav_sign_in: 'Sign In',
    nav_my_profile: 'My Profile & Orders',
    nav_admin_dashboard: 'Admin Dashboard',
    nav_sign_out: 'Sign Out',
    nav_ai_search_tooltip: 'Search by Image (AI Vision)',

    // Actions & Buttons
    btn_buy_now: 'Buy Now',
    btn_add_to_cart: 'Add to Cart',
    btn_added: 'Added',
    btn_add: 'Add',
    btn_checkout: 'Proceed to Checkout',
    btn_view_full_cart: 'View Full Cart',
    btn_continue_shopping: 'Continue Shopping',
    btn_explore_products: 'Explore Catalog',
    btn_save_changes: 'Save Changes',
    btn_apply: 'Apply',
    btn_cancel: 'Cancel',
    btn_shop_now: 'Shop Now',
    btn_view_all: 'View All',
    btn_subscribe: 'Subscribe',
    btn_place_order: 'Confirm & Place Order',
    btn_move_to_cart: 'Move to Cart',
    btn_remove: 'Remove',
    btn_filter: 'Filters',

    // Cart Drawer & Page
    cart_title: 'Your Shopping Cart',
    cart_items_selected: 'items selected',
    cart_item_selected: 'item selected',
    cart_free_delivery_unlocked: 'You unlocked FREE Standard Delivery!',
    cart_add_more_for_free: 'Add more for FREE Delivery',
    cart_empty_title: 'Your cart is currently empty',
    cart_empty_desc: 'Browse our high-performance catalog and add products to start your order.',
    cart_subtotal: 'Subtotal',
    cart_delivery_fee: 'Estimated Delivery',
    cart_vat: 'Estimated VAT (5%)',
    cart_total_due: 'Total Due',
    cart_order_summary: 'Order Summary',
    cart_promo_coupon: 'Promo Voucher / Coupon',
    cart_enter_coupon: 'Enter voucher code...',

    // Product Card & Details
    badge_sale: 'SALE',
    badge_left: 'left',
    txt_reviews: 'Reviews',
    txt_stock_available: 'In Stock & Ready to Ship',
    txt_out_of_stock: 'Out of Stock',
    txt_color: 'Color',
    txt_edition: 'Edition',
    txt_quantity: 'Quantity',
    txt_brand: 'Brand',
    txt_category: 'Category',

    // Catalog & Filters
    filter_title: 'Filters & Refinements',
    filter_reset: 'Reset All',
    filter_categories: 'Categories',
    filter_brands: 'Popular Brands',
    filter_price_range: 'Price Range',
    filter_min_rating: 'Customer Rating',
    filter_stars_up: 'Stars & Above',
    filter_flash_only: '⚡ Flash Deals Only',
    filter_showing: 'Showing',
    filter_products_found: 'products found',
    filter_sort_by: 'Sort By',
    sort_newest: 'Newest Arrivals',
    sort_price_asc: 'Price: Low to High',
    sort_price_desc: 'Price: High to Low',
    sort_rating_desc: 'Highest Customer Rating',

    // Product Details Tabs & Badges
    tab_overview: 'Overview & Highlights',
    tab_specs: 'Technical Specifications',
    tab_reviews: 'Verified Reviews',
    details_fast_shipping: '24-48h Nationwide Fast Delivery',
    details_genuine_warranty: '100% Genuine Official Warranty',
    details_easy_return: '7-Day Hassle-Free Replacement',
    details_related_products: 'Frequently Bought Together & Related Gear',
    details_no_reviews: 'No reviews yet for this product. Be the first to review!',

    // Checkout Flow
    checkout_page_title: 'Checkout & Express Delivery',
    checkout_shipping_details: '1. Shipping & Contact Information',
    checkout_full_name: 'Full Name',
    checkout_phone: 'Mobile Phone (for delivery SMS)',
    checkout_address: 'Full Street Address & Landmark',
    checkout_city: 'City / District',
    checkout_division: 'Division',
    checkout_notes: 'Delivery Instructions / Notes (Optional)',
    checkout_payment_method: '2. Select Payment Method',
    checkout_bkash_nagad: 'bKash & Nagad (10% Instant Cashback)',
    checkout_card: 'Debit / Credit Card (Visa, Mastercard, Amex)',
    checkout_cod: 'Cash on Delivery (Pay upon receiving)',
    checkout_cod_desc: 'Pay cash to the delivery rider after inspecting your parcel.',
    checkout_security_badge: '256-Bit SSL Encrypted & PCI-DSS Level 1 Certified Checkout',

    // Wishlist
    wishlist_title: 'My Saved Hardware & Wishlist',
    wishlist_empty: 'Your wishlist is empty. Explore our catalog and save your dream gadgets!',
    wishlist_move_all_to_cart: 'Add All to Cart',

    // Flash Deals Page
    flash_deals_title: 'Mega Flash Deals',
    flash_hours: 'Hours',
    flash_minutes: 'Mins',
    flash_seconds: 'Secs',

    // AI Assistant Widget
    ai_assistant_title: 'ShopNexus AI Shopping Agent',
    ai_assistant_greeting: 'Hello! I am your AI Hardware Specialist. How can I assist you with your tech gear today?',
    ai_prompt_deals: '🔥 What are today best flash deals?',
    ai_prompt_headphones: '🎧 Recommend the best noise-cancelling headphones',
    ai_prompt_keyboards: '⌨️ Which mechanical keyboard is best for coding?',
    ai_input_placeholder: 'Ask AI assistant about specs, compatibility, budget...',

    // Live Ticker & Banners
    ticker_1: '🔥 18 shoppers ordered headphones & mechanical keyboards in the last hour!',
    ticker_2: '⚡ Over 140+ parcels successfully dispatched today via Pathao Express!',
    ticker_3: '🛡️ Nationwide delivery within 24-48 hours with real-time live tracking!',
    ticker_4: '📦 350+ authentic gadgets safely delivered in the last 24 hours!',
    banner_live_deals: 'Live Flash Deals',
    banner_payday_sale: 'PAYDAY MEGA SALE',
    banner_up_to_80: 'UP TO 80% OFF',
    banner_free_delivery: 'FREE DELIVERY',
    banner_cashback: '10% CASHBACK (bKash & Nagad)',
    banner_sale_live: 'SALE IS LIVE',
    banner_timer_ends: 'Ends in:',

    // Hero Categories
    cat_flash_deals: '⚡ Flash Deals',
    cat_audio: '🎧 Audio & Sound',
    cat_wearables: '⌚ Smartwatches',
    cat_peripherals: '⌨️ Keyboards & Mice',
    cat_smart_home: '🏠 Smart Home',
    cat_all_catalog: '📦 All Catalog',

    // 4 Trust Pillars
    pillar_delivery_title: '24-48h Fast Delivery',
    pillar_delivery_desc: 'Dhaka ৳60 / Outside ৳120',
    pillar_warranty_title: '100% Genuine & Warranty',
    pillar_warranty_desc: 'Official Brand Warranties',
    pillar_return_title: '7 Days Easy Return',
    pillar_return_desc: 'Hassle-Free Replacement',
    pillar_support_title: '24/7 Expert Support',
    pillar_support_desc: 'Live Chat & Hotline Support',

    // Homepage Section Headings
    home_flash_title: 'Flash Deals & Drops',
    home_flash_desc: 'Save up to 40% on verified hardware',
    home_audio_title: 'Acoustics & Studio Sound',
    home_audio_desc: 'Audiophile headphones, DACs & soundbars',
    home_wearables_title: 'Smartwatches & Wearables',
    home_wearables_desc: 'AMOLED displays, sensors & fitness trackers',
    home_peripherals_title: 'Mechanical Keyboards & Gear',
    home_peripherals_desc: 'Hot-swap switches, keycaps & precision mice',
    home_ai_title: 'AI-Powered Superpowers',
    home_ai_desc: 'Next-gen intelligent shopping engine for tech enthusiasts',

    // Newsletter & Footer
    newsletter_title: 'Join 45,000+ Smart Tech Shoppers',
    newsletter_desc: 'Subscribe for instant ৳500 welcome voucher, flash drop alerts & exclusive giveaways.',
    newsletter_placeholder: 'Enter your email address...',
    newsletter_success: '🎉 ৳500 voucher code NEXUS500 sent to your email!',
    footer_brand_desc: 'ShopNexus is a premium next-gen e-commerce platform delivering authentic gadgets, ultra-fast delivery, and seamless online shopping experiences across Bangladesh.',
    footer_security: '100% Secure & PCI-DSS Compliant',
    footer_customer_care: 'Customer Care & Info',
    footer_quick_links: 'Explore & Discover',
    footer_tech_ecosystem: 'AI Tech Ecosystem',
    footer_rights: 'All rights reserved. Designed for elite tech enthusiasts.',

    // About & FAQ
    about_hero_title: 'Empowering Next-Gen Hardware Enthusiasts',
    about_hero_sub: 'Authentic electronics, verified genuine supply chain, and sub-second intelligent commerce across Bangladesh.',
    about_faq_title: 'Frequently Asked Questions (FAQ)',

    // Auth Pages
    auth_welcome_back: 'Welcome Back',
    auth_sign_in_sub: 'Sign in to your ShopNexus account',
    auth_create_acc: 'Create Account',
    auth_create_acc_sub: 'Get started with ShopNexus official ecosystem',
    auth_forgot_pass: 'Password Recovery',
    auth_email_label: 'Email Address',
    auth_password_label: 'Password',
    auth_full_name: 'Full Name',
    auth_already_have_acc: 'Already have an account?',
    auth_dont_have_acc: "Don't have an account?",
    auth_forgot_link: 'Forgot password?',
  },
  bn: {
    // Navigation
    nav_home: 'হোম',
    nav_products: 'পণ্যসমূহ',
    nav_flash_deals: 'ফ্ল্যাশ ডিল',
    nav_search_placeholder: 'পণ্য, ব্র্যান্ড, গ্যাজেট খুঁজুন...',
    nav_cart: 'কার্ট',
    nav_wishlist: 'উইশলিস্ট',
    nav_notifications: 'বিজ্ঞপ্তি',
    nav_sign_in: 'সাইন ইন',
    nav_my_profile: 'আমার প্রোফাইল ও অর্ডার',
    nav_admin_dashboard: 'এডমিন ড্যাশবোর্ড',
    nav_sign_out: 'লগ আউট',
    nav_ai_search_tooltip: 'ছবি দিয়ে খুঁজুন (AI ভিশন)',

    // Actions & Buttons
    btn_buy_now: 'এখনই কিনুন',
    btn_add_to_cart: 'কার্টে যোগ করুন',
    btn_added: 'যুক্ত হয়েছে',
    btn_add: 'যোগ করুন',
    btn_checkout: 'চেকআউটে এগিয়ে যান',
    btn_view_full_cart: 'সম্পূর্ণ কার্ট দেখুন',
    btn_continue_shopping: 'কেনাকাটা চালিয়ে যান',
    btn_explore_products: 'ক্যাটালগ দেখুন',
    btn_save_changes: 'পরিবর্তন সংরক্ষণ করুন',
    btn_apply: 'প্রয়োগ করুন',
    btn_cancel: 'বাতিল',
    btn_shop_now: 'এখনই কিনুন',
    btn_view_all: 'সবগুলো দেখুন',
    btn_subscribe: 'সাবস্ক্রাইব করুন',
    btn_place_order: 'অর্ডার নিশ্চিত করুন',
    btn_move_to_cart: 'কার্টে নিন',
    btn_remove: 'মুছুন',
    btn_filter: 'ফিল্টার',

    // Cart Drawer & Page
    cart_title: 'আপনার শপিং কার্ট',
    cart_items_selected: 'টি পণ্য নির্বাচিত',
    cart_item_selected: 'টি পণ্য নির্বাচিত',
    cart_free_delivery_unlocked: '🎉 আপনি ফ্রি স্ট্যান্ডার্ড ডেলিভারি সুবিধা পেয়েছেন!',
    cart_add_more_for_free: 'ফ্রি ডেলিভারি পেতে আরও পণ্য যোগ করুন',
    cart_empty_title: 'আপনার কার্ট বর্তমানে খালি রয়েছে',
    cart_empty_desc: 'আমাদের আকর্ষণীয় ক্যাটালগ ঘুরে দেখুন এবং আপনার পছন্দের পণ্য কার্টে যোগ করুন।',
    cart_subtotal: 'সাবটোটাল',
    cart_delivery_fee: 'আনুমানিক ডেলিভারি চার্জ',
    cart_vat: 'আনুমানিক ভ্যাট (৫%)',
    cart_total_due: 'সর্বমোট প্রদেয়',
    cart_order_summary: 'অর্ডার সারাংশ',
    cart_promo_coupon: 'প্রোমো ভাউচার / কুপন কোড',
    cart_enter_coupon: 'কুপন কোড লিখুন...',

    // Product Card & Details
    badge_sale: 'ছাড়',
    badge_left: 'টি বাকি',
    txt_reviews: 'রিভিউ',
    txt_stock_available: 'স্টকে আছে ও দ্রুত ডেলিভারির জন্য প্রস্তুত',
    txt_out_of_stock: 'স্টক শেষ',
    txt_color: 'কালার',
    txt_edition: 'সংস্করণ',
    txt_quantity: 'পরিমাণ',
    txt_brand: 'ব্র্যান্ড',
    txt_category: 'ক্যাটাগরি',

    // Catalog & Filters
    filter_title: 'ফিল্টার ও বাছাইকরণ',
    filter_reset: 'সব রিসেট',
    filter_categories: 'ক্যাটাগরিসমূহ',
    filter_brands: 'জনপ্রিয় ব্র্যান্ড',
    filter_price_range: 'দামের সীমা (টাকা)',
    filter_min_rating: 'কাস্টমার রেটিং',
    filter_stars_up: 'স্টার ও তদূর্ধ্ব',
    filter_flash_only: '⚡ শুধুমাত্র ফ্ল্যাশ ডিল',
    filter_showing: 'দেখানো হচ্ছে',
    filter_products_found: 'টি পণ্য পাওয়া গেছে',
    filter_sort_by: 'বাছাইয়ের ধরন',
    sort_newest: 'সর্বশেষ নতুন পণ্য',
    sort_price_asc: 'দাম: কম থেকে বেশি',
    sort_price_desc: 'দাম: বেশি থেকে কম',
    sort_rating_desc: 'সর্বোচ্চ কাস্টমার রেটিং',

    // Product Details Tabs & Badges
    tab_overview: 'ওভারভিউ ও বৈশিষ্ট্য',
    tab_specs: 'টেকনিক্যাল স্পেসিফিকেশন',
    tab_reviews: 'ভেরিফাইড কাস্টমার রিভিউ',
    details_fast_shipping: '২৪-৪৮ ঘণ্টায় সারাদেশে দ্রুত ডেলিভারি',
    details_genuine_warranty: '১০০% জেনুইন অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি',
    details_easy_return: '৭ দিনের সহজ রিপ্লেসমেন্ট সুবিধা',
    details_related_products: 'সম্পর্কিত ও একসাথে জনপ্রিয় পণ্যসমূহ',
    details_no_reviews: 'এখনও কোনো রিভিউ দেওয়া হয়নি। আপনিই প্রথম রিভিউ দিন!',

    // Checkout Flow
    checkout_page_title: 'চেকআউট ও এক্সপ্রেস ডেলিভারি',
    checkout_shipping_details: '১. ডেলিভারি ও যোগাযোগের তথ্য',
    checkout_full_name: 'পূর্ণ নাম',
    checkout_phone: 'মোবাইল নম্বর (ডেলিভারি SMS এর জন্য)',
    checkout_address: 'সম্পূর্ণ ঠিকানা ও ল্যান্ডমার্ক',
    checkout_city: 'শহর / জেলা',
    checkout_division: 'বিভাগ',
    checkout_notes: 'ডেলিভারি সংক্রান্ত নির্দেশনা (ঐচ্ছিক)',
    checkout_payment_method: '২. পেমেন্ট মেথড নির্বাচন করুন',
    checkout_bkash_nagad: 'বিকাশ ও নগদ (১০% ইনস্ট্যান্ট ক্যাশব্যাক)',
    checkout_card: 'ডেবিট / ক্রেডিট কার্ড (ভিসা, মাস্টারকার্ড)',
    checkout_cod: 'ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য পরিশোধ)',
    checkout_cod_desc: 'ডেলিভারি রাইডারের কাছ থেকে পার্সেল চেক করে ক্যাশে মূল্য পরিশোধ করুন।',
    checkout_security_badge: '২৫৬-বিট SSL এনক্রিপ্টেড ও সম্পূর্ণ নিরাপদ চেকআউট',

    // Wishlist
    wishlist_title: 'সংরক্ষিত পণ্য ও উইশলিস্ট',
    wishlist_empty: 'আপনার উইশলিস্ট খালি। ক্যাটালগ থেকে আপনার পছন্দের পণ্য সংরক্ষণ করুন!',
    wishlist_move_all_to_cart: 'সব পণ্য কার্টে যোগ করুন',

    // Flash Deals Page
    flash_deals_title: 'মেগা ফ্ল্যাশ ডিলস',
    flash_hours: 'ঘণ্টা',
    flash_minutes: 'মিনিট',
    flash_seconds: 'সেকেন্ড',

    // AI Assistant Widget
    ai_assistant_title: 'ShopNexus AI শপিং সহকারী',
    ai_assistant_greeting: 'হ্যালো! আমি আপনার AI শপিং বিশেষজ্ঞ। আপনার পছন্দের গ্যাজেট বাছাই করতে কীভাবে সাহায্য করতে পারি?',
    ai_prompt_deals: '🔥 আজকের সেরা ফ্ল্যাশ ডিল কোনগুলো?',
    ai_prompt_headphones: '🎧 সেরা নয়েজ-ক্যানসেলিং হেডফোনের পরামর্শ দিন',
    ai_prompt_keyboards: '⌨️ কোডিং ও টাইপিংয়ের জন্য কোন মেকানিক্যাল কিবোর্ড সেরা?',
    ai_input_placeholder: 'প্রোডাক্টের স্পেক্স, বাজেট বা পরামর্শ জানতে AI-কে লিখুন...',

    // Live Ticker & Banners
    ticker_1: '🔥 ১৮ জন ক্রেতা গত ১ ঘণ্টায় হেডফোন ও কিবোর্ড অর্ডার করেছেন!',
    ticker_2: '⚡ আজ ১৪০+ পার্সেল পাঠাও এক্সপ্রেসের মাধ্যমে সফলভাবে ডিসপ্যাচ হয়েছে!',
    ticker_3: '🛡️ সারাদেশে মাত্র ২৪-৪৮ ঘণ্টায় নিশ্চিত ডেলিভারি ও রিয়েল-টাইম ট্র্যাকিং!',
    ticker_4: '📦 গত ২৪ ঘণ্টায় ৩৫০+ জেনুইন গ্যাজেট ডেলিভারি সফলভাবে সম্পন্ন হয়েছে!',
    banner_live_deals: 'লাইভ ফ্ল্যাশ ডিলস',
    banner_payday_sale: '🔥 পে-ডে মেগা সেল',
    banner_up_to_80: '৮০% পর্যন্ত ছাড়',
    banner_free_delivery: 'ফ্রি ডেলিভারি',
    banner_cashback: '১০% ক্যাশব্যাক (বিকাশ ও নগদ)',
    banner_sale_live: 'সেল চলছে',
    banner_timer_ends: 'বাকি সময়:',

    // Hero Categories
    cat_flash_deals: '⚡ ফ্ল্যাশ ডিল',
    cat_audio: '🎧 অডিও ও সাউন্ড',
    cat_wearables: '⌚ স্মার্টওয়াচ',
    cat_peripherals: '⌨️ কিবোর্ড ও মাউস',
    cat_smart_home: '🏠 স্মার্ট হোম',
    cat_all_catalog: '📦 সম্পূর্ণ ক্যাটালগ',

    // 4 Trust Pillars
    pillar_delivery_title: '২৪-৪৮ ঘণ্টায় দ্রুত ডেলিভারি',
    pillar_delivery_desc: 'ঢাকা ৳৬০ / ঢাকার বাইরে ৳১২০',
    pillar_warranty_title: '১০০% জেনুইন ও অফিসিয়াল ওয়ারেন্টি',
    pillar_warranty_desc: 'ব্র্যান্ডের অথেন্টিক ওয়ারেন্টি সুবিধা',
    pillar_return_title: '৭ দিনের সহজ রিটার্ন',
    pillar_return_desc: 'ঝামেলাহীন রিপ্লেসমেন্ট গ্যারান্টি',
    pillar_support_title: '২৪/৭ কাস্টমার সাপোর্ট',
    pillar_support_desc: 'লাইভ চ্যাট ও সার্বক্ষণিক সহায়তা',

    // Homepage Section Headings
    home_flash_title: 'ফ্ল্যাশ ডিলস ও অফার',
    home_flash_desc: 'জেনুইন হার্ডওয়্যার পণ্যে ৪০% পর্যন্ত দারুণ ছাড়',
    home_audio_title: 'প্রিমিয়াম অ্যাকোস্টিক ও অডিও গিয়ার',
    home_audio_desc: 'অডিওফাইল হেডফোন, ইয়ারফোন ও সাউন্ডবার',
    home_wearables_title: 'স্মার্টওয়াচ ও পরিধানযোগ্য গ্যাজেট',
    home_wearables_desc: 'অ্যামোলেড ডিসপ্লে ও স্পোর্টস সেন্সর',
    home_peripherals_title: 'কাস্টম মেকানিক্যাল কিবোর্ড ও এক্সেসরিজ',
    home_peripherals_desc: 'হট-সোয়াপ সুইচ ও প্রিমিয়াম প্রিসিশন মাউস',
    home_ai_title: 'AI স্মার্ট শপিং ফিচারসমূহ',
    home_ai_desc: 'আপনার কেনাকাটাকে সহজ ও দ্রুত করতে আধুনিক ইন্টেলিজেন্ট ইঞ্জিন',

    // Newsletter & Footer
    newsletter_title: 'যুক্ত হোন ৪৫,০০০+ স্মার্ট টেক ক্রেতার সাথে',
    newsletter_desc: 'সাবস্ক্রাইব করলেই সাথে সাথে ৫০০ টাকার ওয়েলকাম ভাউচার কোড, অফার ও আপডেট পাবেন।',
    newsletter_placeholder: 'আপনার ইমেইল অ্যাড্রেস লিখুন...',
    newsletter_success: '🎉 আপনার ৫০০ টাকার ভাউচার কোড NEXUS500 পাঠানো হয়েছে!',
    footer_brand_desc: 'ShopNexus হলো বাংলাদেশের শীর্ষস্থানীয় প্রিমিয়াম ই-কমার্স প্ল্যাটফর্ম, যা শতভাগ আসল গ্যাজেট, দ্রুততম ডেলিভারি এবং আধুনিক শপিং অভিজ্ঞতা প্রদান করে।',
    footer_security: '১০০% নিরাপদ ও PCI-DSS কমপ্লায়েন্ট',
    footer_customer_care: 'কাস্টমার কেয়ার ও সহায়তা',
    footer_quick_links: 'প্রয়োজনীয় লিংকসমূহ',
    footer_tech_ecosystem: 'AI টেক ইকোসিস্টেম',
    footer_rights: 'সর্বস্বত্ব সংরক্ষিত। ShopNexus Bangladesh.',

    // About & FAQ
    about_hero_title: 'নেক্সট-জেন গ্যাজেট ও হার্ডওয়্যার ইকোসিস্টেম',
    about_hero_sub: 'শতভাগ আসল ব্র্যান্ডেড পণ্য, যাচাইকৃত সরবরাহ ব্যবস্থা ও বাংলাদেশের সবচেয়ে দ্রুততম ই-কমার্স অভিজ্ঞতা।',
    about_faq_title: 'সাধারণ জিজ্ঞাসাসমূহ (FAQ)',

    // Auth Pages
    auth_welcome_back: 'স্বাগতম',
    auth_sign_in_sub: 'আপনার ShopNexus অ্যাকাউন্টে সাইন ইন করুন',
    auth_create_acc: 'নতুন অ্যাকাউন্ট তৈরি করুন',
    auth_create_acc_sub: 'ShopNexus অফিসিয়াল ইকোসিস্টেমে যুক্ত হন',
    auth_forgot_pass: 'পাসওয়ার্ড পুনরুদ্ধার',
    auth_email_label: 'ইমেইল অ্যাড্রেস',
    auth_password_label: 'পাসওয়ার্ড',
    auth_full_name: 'পূর্ণ নাম',
    auth_already_have_acc: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    auth_dont_have_acc: 'অ্যাকাউন্ট নেই?',
    auth_forgot_link: 'পাসওয়ার্ড ভুলে গেছেন?',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

// Helper to convert English digits to Bengali numerals
export const toBengaliNumber = (num?: number | string | null): string => {
  if (num === undefined || num === null) return '';
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)] || digit);
};

export const formatCurrency = (amount?: number | null, lang: Language = 'bn'): string => {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const formatted = safeAmount.toLocaleString();
  if (lang === 'bn') {
    return `৳${toBengaliNumber(formatted)}`;
  }
  return `৳${formatted}`;
};
