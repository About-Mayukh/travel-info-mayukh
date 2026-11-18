-- ==============================================================================
-- WanderSpot Seed Data: Real Tourist Spots across India & Sample Reviews
-- ==============================================================================

-- Clean up existing data for fresh seed if needed
delete from reviews;
delete from photos;
delete from bookings;
delete from favorites;
delete from spots;

-- 1. SEED SPOTS (25 prime spots across 5 famous regions: Darjeeling, Jaipur, Digha, Goa, Munnar)

-- DARJEELING (Hill Station)
insert into spots (id, area, name, description, category, latitude, longitude, adult_price, child_price, best_time, cover_image, cover_credit_name, cover_credit_url) values
(
  '11111111-1111-1111-1111-111111111101',
  'Darjeeling',
  'Tiger Hill Sunrise Viewpoint',
  'Perched at 2,590 meters, Tiger Hill is renowned worldwide for its panoramic view of Mount Kanchenjunga bathed in golden morning light before sunrise.',
  'hill',
  26.9944,
  88.2713,
  100,
  50,
  'October to April (5:00 AM)',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  'Sankarshan Mukhopadhyay',
  'https://unsplash.com/@sankarshan'
),
(
  '11111111-1111-1111-1111-111111111102',
  'Darjeeling',
  'Batasia Loop & War Memorial',
  'A magnificent spiral railway loop where the Toy Train negotiates a steep gradient amid manicured gardens, commanding 360-degree views of the Eastern Himalayas.',
  'heritage',
  27.0167,
  88.2500,
  50,
  25,
  'September to May',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
  'Abhishek Prasad',
  'https://unsplash.com/@abhishek'
),
(
  '11111111-1111-1111-1111-111111111103',
  'Darjeeling',
  'Happy Valley Tea Estate',
  'Spread across 177 hectares at 2,100 meters, this historic 1854 tea garden produces some of the world finest muscatel orthodox Darjeeling teas with guided factory tours.',
  'heritage',
  27.0544,
  88.2612,
  150,
  75,
  'March to November (Plucking season)',
  'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1200&q=80',
  'Kunal Shinde',
  'https://unsplash.com/@kunal'
),
(
  '11111111-1111-1111-1111-111111111104',
  'Darjeeling',
  'Padmaja Naidu Himalayan Zoological Park',
  'India largest high-altitude zoo, globally celebrated for pioneering conservation breeding programs for endangered Red Pandas and Snow Leopards.',
  'wildlife',
  27.0592,
  88.2558,
  110,
  50,
  'Throughout the year (closed Thursdays)',
  'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
  'Ankur Gudagi',
  'https://unsplash.com/@ankurg'
),
(
  '11111111-1111-1111-1111-111111111105',
  'Darjeeling',
  'Ghum Monastery (Yiga Choeling)',
  'Established in 1850 by Lama Sherab Gyatso, this revered Gelugpa Buddhist monastery enshrines a striking 15-foot statue of Maitreya Buddha and rare Tibetan manuscripts.',
  'religious',
  27.0116,
  88.2575,
  30,
  0,
  'October to May',
  'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
  'Pradeep Sen',
  'https://unsplash.com/@pradeep'
);

-- JAIPUR (The Pink City - Heritage & Palaces)
insert into spots (id, area, name, description, category, latitude, longitude, adult_price, child_price, best_time, cover_image, cover_credit_name, cover_credit_url) values
(
  '22222222-2222-2222-2222-222222222201',
  'Jaipur',
  'Amber Palace (Amer Fort)',
  'An opulent hilltop citadel of yellow and pink sandstone blending Hindu and Mughal styles, featuring the glittering Sheesh Mahal (Mirror Palace) overlooking Maota Lake.',
  'heritage',
  26.9855,
  75.8513,
  200,
  100,
  'October to March (Morning/Evening Light Show)',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  'Sylwia Bartyzel',
  'https://unsplash.com/@sylwiabartyzel'
),
(
  '22222222-2222-2222-2222-222222222202',
  'Jaipur',
  'Hawa Mahal (Palace of Winds)',
  'The iconic 5-storey facade built in 1799 with 953 intricately carved jharokhas (casements) that allowed royal ladies to witness street life unseen.',
  'heritage',
  26.9239,
  75.8267,
  100,
  50,
  'October to March',
  'https://images.unsplash.com/photo-1609137144822-1d5440d99ef8?auto=format&fit=crop&w=1200&q=80',
  'Annie Spratt',
  'https://unsplash.com/@anniespratt'
),
(
  '22222222-2222-2222-2222-222222222203',
  'Jaipur',
  'City Palace & Museum',
  'A monumental complex in the heart of the walled city housing Chandra Mahal, Mubarak Mahal, courtyards, textiles, armory, and living royal quarters.',
  'heritage',
  26.9258,
  75.8237,
  300,
  150,
  'November to February',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
  'Parth Vyas',
  'https://unsplash.com/@parth'
),
(
  '22222222-2222-2222-2222-222222222204',
  'Jaipur',
  'Jantar Mantar Astronomical Observatory',
  'UNESCO World Heritage site featuring 19 monumental stone architectural instruments built by Maharaja Sawai Jai Singh II, including the world largest stone sundial.',
  'heritage',
  26.9248,
  75.8246,
  100,
  50,
  'October to March (Midday for sun observations)',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  'Jitendra Singh',
  'https://unsplash.com/@jitendra'
),
(
  '22222222-2222-2222-2222-222222222205',
  'Jaipur',
  'Nahargarh Fort & Padao Sunset',
  'Standing proudly atop the Aravalli hills overlooking the pink city, Nahargarh served as a fierce defense retreat and offers the most breathtaking sunset vista in Rajasthan.',
  'hill',
  26.9374,
  75.8156,
  100,
  50,
  'October to March (Sunset hours)',
  'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=1200&q=80',
  'Kunal Kalra',
  'https://unsplash.com/@kunalkalra'
);

-- DIGHA (Bengal Coastal Gem - Beach & Sea Life)
insert into spots (id, area, name, description, category, latitude, longitude, adult_price, child_price, best_time, cover_image, cover_credit_name, cover_credit_url) values
(
  '33333333-3333-3333-3333-333333333301',
  'Digha',
  'New Digha Sea Beach',
  'A wide, clean beachfront flanked by casuarina plantations with gentle rolling Bay of Bengal waves, water sports, and fresh seaside seafood stalls.',
  'beach',
  21.6247,
  87.5085,
  0,
  0,
  'October to March',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'Sean Oulashin',
  'https://unsplash.com/@oulashin'
),
(
  '33333333-3333-3333-3333-333333333302',
  'Digha',
  'Marine Aquarium & Regional Centre (MARC)',
  'India largest coastal marine aquarium operated by Zoological Survey of India, housing local sharks, stingrays, sea anemones, and rare estuarine biodiversity.',
  'wildlife',
  21.6288,
  87.5186,
  40,
  20,
  'Throughout the year',
  'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&w=1200&q=80',
  'David Clode',
  'https://unsplash.com/@davidclode'
),
(
  '33333333-3333-3333-3333-333333333303',
  'Digha',
  'Udaipur Pristine Border Beach',
  'A tranquil, untouched stretch of coastline near the Bengal-Odisha border famous for red crabs scuttling across golden sands, horse rides, and quiet sunsets.',
  'beach',
  21.6142,
  87.4912,
  0,
  0,
  'September to March',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
  'Tiago Fioreze',
  'https://unsplash.com/@tiagofioreze'
),
(
  '33333333-3333-3333-3333-333333333304',
  'Digha',
  'Amarabati Lake & Cable Car Park',
  'A beautifully landscaped recreational park centered around a tranquil boating lake with an aerial ropeway cable car offering birds-eye views of New Digha.',
  'hill',
  21.6242,
  87.5133,
  30,
  15,
  'October to April',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'Bailey Zindel',
  'https://unsplash.com/@baileyzindel'
),
(
  '33333333-3333-3333-3333-333333333305',
  'Digha',
  'Digha Science Centre & Planetarium',
  'An engaging science discovery park and digital planetarium featuring interactive fun-mirror galleries, jurassic park animatronics, and space telescope shows.',
  'heritage',
  21.6272,
  87.5165,
  50,
  25,
  'Throughout the year',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'NASA',
  'https://unsplash.com/@nasa'
);

-- GOA (Sun, Sand & Portuguese Heritage)
insert into spots (id, area, name, description, category, latitude, longitude, adult_price, child_price, best_time, cover_image, cover_credit_name, cover_credit_url) values
(
  '44444444-4444-4444-4444-444444444401',
  'Goa',
  'Baga Beach & Water Sports Hub',
  'One of North Goa most vibrant shorelines, buzzing with parasailing, jet skiing, beach shacks, live acoustic music, and sunbeds along golden sand.',
  'beach',
  15.5553,
  73.7517,
  0,
  0,
  'November to March',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  'Ashok Acharya',
  'https://unsplash.com/@ashok'
),
(
  '44444444-4444-4444-4444-444444444402',
  'Goa',
  'Basilica of Bom Jesus',
  'A 1605 UNESCO World Heritage Baroque church in Old Goa that preserves the mortal remains of Saint Francis Xavier, revered as a benchmark of colonial architecture.',
  'religious',
  15.5009,
  73.9116,
  0,
  0,
  'November to February',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  'Rohan Reddy',
  'https://unsplash.com/@rohanreddy'
),
(
  '44444444-4444-4444-4444-444444444403',
  'Goa',
  'Aguada Fort & Lighthouse',
  'A formidable 17th-century Portuguese fortress overlooking the Mandovi river and Arabian Sea, once holding 79 artillery cannons and a 4-storey freshwater reservoir.',
  'heritage',
  15.4927,
  73.7735,
  50,
  25,
  'October to March',
  'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=1200&q=80',
  'Koushik Chowdary',
  'https://unsplash.com/@koushik'
),
(
  '44444444-4444-4444-4444-444444444404',
  'Goa',
  'Dudhsagar Waterfalls',
  'A spectacular four-tiered cascade of white foaming water plunging 310 meters on the Mandovi river through the verdant Western Ghats railway bridge.',
  'wildlife',
  15.3144,
  74.3143,
  150,
  75,
  'June to December (Monsoon grandeur)',
  'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=1200&q=80',
  'Abhishek Sanwa',
  'https://unsplash.com/@abhisheksanwa'
),
(
  '44444444-4444-4444-4444-444444444405',
  'Goa',
  'Anjuna Beach & Flea Market',
  'Famous for its distinctive laterite rock formations, bohemian trance culture, coconut palms, and the weekly craft market featuring artisan treasures.',
  'beach',
  15.5733,
  73.7410,
  0,
  0,
  'November to April (Wednesdays for market)',
  'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=80',
  'Frederik Trovatten',
  'https://unsplash.com/@trovatten'
);

-- MUNNAR (Misty Tea Valleys & Western Ghats)
insert into spots (id, area, name, description, category, latitude, longitude, adult_price, child_price, best_time, cover_image, cover_credit_name, cover_credit_url) values
(
  '55555555-5555-5555-5555-555555555501',
  'Munnar',
  'Eravikulam National Park (Rajamalai)',
  'Home to the endangered Nilgiri Tahr mountain goat and the legendary Neelakurinji flower that blooms once every 12 years across high-altitude rolling shola grasslands.',
  'wildlife',
  10.1983,
  77.0655,
  200,
  150,
  'September to March (Closed during calving season Feb-Mar)',
  'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
  'Biju Boro',
  'https://unsplash.com/@bijuboro'
),
(
  '55555555-5555-5555-5555-555555555502',
  'Munnar',
  'Mattupetty Dam & Speedboat Lake',
  'A solid gravity dam nestled among undulating tea estates where wild elephants frequently come to drink, offering thrilling speedboat cruises.',
  'hill',
  10.1042,
  77.1245,
  50,
  25,
  'October to May',
  'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  'Aman Upadhyay',
  'https://unsplash.com/@amanupadhyay'
),
(
  '55555555-5555-5555-5555-555555555503',
  'Munnar',
  'KDHP Tea Museum & Factory',
  'Chronicles the legacy of tea cultivation in Idukki with century-old processing rollers, tea tasting sessions, and tea plucking demonstrations.',
  'heritage',
  10.0889,
  77.0601,
  125,
  50,
  'Throughout the year (closed Mondays)',
  'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=1200&q=80',
  'Nandhu Kumar',
  'https://unsplash.com/@nandhukumar'
),
(
  '55555555-5555-5555-5555-555555555504',
  'Munnar',
  'Top Station Cloud Panorama',
  'The highest point on the Munnar-Kodaikanal road at 1,880 meters, offering jaw-dropping views of cloud seas blanketing the neighboring state of Tamil Nadu.',
  'hill',
  10.1258,
  77.2439,
  50,
  25,
  'October to April',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
  'Vivek Kumar',
  'https://unsplash.com/@vivek'
),
(
  '55555555-5555-5555-5555-555555555505',
  'Munnar',
  'Anamudi Peak Lookout',
  'The highest peak in South India standing tall at 2,695 meters, known as the Everest of South India, shrouded in pristine evergreen subtropical forests.',
  'hill',
  10.1700,
  77.0640,
  50,
  25,
  'November to May',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  'Kalpa Madurasinghe',
  'https://unsplash.com/@kalpa'
);

-- 2. SAMPLE REVIEWS
-- Note: When deployed with real users, reviews link to real profiles.id.
-- Below are representative reviews pre-seeded for initial demonstration.
insert into reviews (spot_id, rating, comment) values
('11111111-1111-1111-1111-111111111101', 5, 'Waking up at 4 AM was totally worth it. The golden glow over Kanchenjunga made the entire crowd gasp! Truly surreal.'),
('11111111-1111-1111-1111-111111111101', 5, 'Dress warmly, it was 2°C! The view is unforgettable on a clear day.'),
('11111111-1111-1111-1111-111111111102', 4, 'Watching the steam toy train loop through the flowers with snowy peaks in the background is quintessential Darjeeling.'),
('11111111-1111-1111-1111-111111111102', 5, 'Great tribute to Gorkha soldiers, peaceful gardens and fabulous camera angles.'),
('22222222-2222-2222-2222-222222222201', 5, 'Sheesh Mahal mirror room reflected candlelight in hundreds of stars! Hire an authorized guide for the stories.'),
('22222222-2222-2222-2222-222222222201', 5, 'The architecture is colossal and breathtaking. Evening light and sound show is deeply moving.'),
('22222222-2222-2222-2222-222222222202', 4, 'Such unique engineering! The natural breeze through the 953 stone windows really keeps it cool even in summer.'),
('33333333-3333-3333-3333-333333333301', 4, 'Very wide beach, gentle slope into the sea makes it super safe for families and kids. Sunrise was stunning.'),
('33333333-3333-3333-3333-333333333301', 5, 'Fresh fried pomfret and coconut water right on the beach after morning bath. Best weekend getaway from Kolkata.'),
('44444444-4444-4444-4444-444444444401', 5, 'Parasailing was thrilling! Water was clear and the nightlife right next to the beach is full of energy.'),
('44444444-4444-4444-4444-444444444402', 5, 'Historic, serene, and spiritually grounding. The intricate gilded altars and marble floor carvings are astonishing.'),
('55555555-5555-5555-5555-555555555501', 5, 'We saw a mother Nilgiri Tahr and her calf within 15 minutes! The rolling misty hills look straight out of Scotland.');

-- 3. SAMPLE APPROVED COMMUNITY PHOTOS
insert into photos (spot_id, image_url, approved, likes) values
('11111111-1111-1111-1111-111111111101', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80', true, 42),
('11111111-1111-1111-1111-111111111101', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', true, 19),
('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', true, 67),
('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80', true, 31),
('33333333-3333-3333-3333-333333333301', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', true, 28),
('44444444-4444-4444-4444-444444444401', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', true, 53),
('55555555-5555-5555-5555-555555555501', 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80', true, 39);
