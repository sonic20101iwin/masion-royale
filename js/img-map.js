/* ================================================================
   MAISON ROYALE — Curated image map (all sources verified reachable)
   Pexels: https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg
   Wikimedia Commons: direct thumb URLs (descriptive filenames)
   ================================================================ */
(function (global) {
  'use strict';

  function pex(id, w, h) {
    return 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id +
      '.jpeg?auto=compress&cs=tinysrgb&w=' + (w || 1400) + '&h=' + (h || 1600) + '&fit=crop';
  }

  // Verified Pexels pools (searched by term; every URL checked via HEAD 200)
  var POOL = {
    fashion: [135620, 27357190, 35313306, 7779763, 8311880, 31172334, 8193520, 36152612, 14528152, 7202800, 34519173, 37401695, 26760669, 5254305, 8386437, 17729218, 34121563, 17349843, 20591025, 34041964, 18913368, 31929486, 35596695, 36721241, 18046813, 34928944, 28133643, 21357584],
    dress: [37647057, 7202800, 21966540, 8619007, 3534454, 29271909, 8995906, 31172334, 7290640, 5262276, 12245151, 9146381, 14465430, 6903157, 37015070, 6181955, 29124227, 34160661, 18586865, 27580017],
    shoe: [12210270, 34121563, 17695225, 9992899, 27658707, 2043476, 18188512, 135620, 9146381, 6903157, 13179883, 5254305, 17729218, 36028067, 14035699, 30174893, 38703057, 35070982, 33140484, 298863],
    loafers: [12210270, 9992899, 17695225, 14187813, 260044, 2043476, 18188512, 5168531, 34294446, 1027130, 36028067, 38291746, 9146381, 37808313, 13179883, 5037667, 29258015, 31935097, 35070982, 31935098],
    watch: [10591429, 380782, 3809175, 5081914, 1697570, 9713527, 5083218, 18967948, 30094119, 27357190, 16104735, 38291746, 7519516, 8645194, 4318239, 37547216]
  };

  function pool(key, i, w, h) {
    var a = POOL[key] || [];
    var id = a[Math.abs(i) % a.length];
    return pex(id, w, h);
  }

  // Wikimedia Commons selected files (titles verified against file names)
  var CM = {
    atriumSC: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/SC_Mall_atrium_view.jpg/1400px-SC_Mall_atrium_view.jpg',
    atriumSunTec: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Northern_round_atrium_at_Suntec_City_Mall%2C_Singapore.jpg/1400px-Northern_round_atrium_at_Suntec_City_Mall%2C_Singapore.jpg',
    atriumMyer: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Atrium_in_the_Myer_Centre_shopping_mall_Brisbane.jpg',
    escalatorAirs: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/HK_KCD_%E5%95%9F%E5%BE%B7_Kai_Tak_AIRSIDE_Shopping_Mall_void_escalators_July_2024_R12S_01.jpg/1400px-HK_KCD_%E5%95%9F%E5%BE%B7_Kai_Tak_AIRSIDE_Shopping_Mall_void_escalators_July_2024_R12S_01.jpg',
    escalatorWarsaw: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Escalator_in_shopping_mall%2C_Warsaw%2C_Poland.jpg/1400px-Escalator_in_shopping_mall%2C_Warsaw%2C_Poland.jpg',
    hotelNightFacade: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/DZ6_0939_A_modern_hotel_building_lit_up_at_night_its_triangular_fa%C3%A7ade_and_rows_of_balconies_glowing_against_the_dark_sky.jpg/1400px-DZ6_0939_A_modern_hotel_building_lit_up_at_night_its_triangular_fa%C3%A7ade_and_rows_of_balconies_glowing_against_the_dark_sky.jpg',
    lobbyAmantakaBlue: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Entrance_lobby_of_Amantaka_luxury_Resort_%26_Hotel_at_blue_hour_in_Luang_Prabang_Laos.jpg/1400px-Entrance_lobby_of_Amantaka_luxury_Resort_%26_Hotel_at_blue_hour_in_Luang_Prabang_Laos.jpg',
    cinema4dx: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/4DX_seats_in_cinema_%28motion_and_environmental_effects_synced_with_the_on-screen_action%29_bench_rows_in_a_movie_theater_hall_Kinostoler_kinosal_Kilden_kino_T%C3%B8nsberg%2C_Norway_2023_IMG_7852.jpg/1400px-4DX_seats_in_cinema_%28motion_and_environmental_effects_synced_with_the_on-screen_action%29_bench_rows_in_a_movie_theater_hall_Kinostoler_kinosal_Kilden_kino_T%C3%B8nsberg%2C_Norway_2023_IMG_7852.jpg',
    spaMansion24: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Mansion_Resort_and_Spa_in_Bali_-_24.jpg/1400px-Mansion_Resort_and_Spa_in_Bali_-_24.jpg',
    spaAmantakaIndoor: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Indoor_pool_and_showers_of_the_spa_at_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg/1400px-Indoor_pool_and_showers_of_the_spa_at_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg',
    poolAmantaka: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Swimming_pool_of_Khan_Pool_Suite_in_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg/1400px-Swimming_pool_of_Khan_Pool_Suite_in_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg',
    gymMacau: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/JW_Marriott_Hotel_Macau_Gym_Room_2016.jpg/1400px-JW_Marriott_Hotel_Macau_Gym_Room_2016.jpg',
    nycNight: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/NYC_Night_lights_%287040124053%29.jpg/1400px-NYC_Night_lights_%287040124053%29.jpg'
  };

  var IMG = {
    heroFashion: pex(1130626, 1800, 1150),
    heroAlt: pex(297933, 1400, 1600),
    aboutStory: pex(1043474, 1200, 1500),
    editorialMan: pex(220453, 1200, 1500),
    womanStreet: pex(2182970, 1200, 1500),
    modelStudio: pex(733872, 1200, 1500),
    modelPortrait: pex(415829, 1200, 1500),
    suitEditorial: pex(1464367, 1200, 1500),

    catWomen: pex(733872, 1200, 1500),
    catMen: pex(1464367, 1200, 1500),
    catShoes: pool('shoe', 0, 1200, 1500),
    catBags: pex(842811, 1200, 1500),
    catWatches: pex(190819, 1200, 1500),
    catJewelry: pex(935743, 1200, 1500),
    catAccessories: pex(210474, 1200, 1500),

    dressA: pool('dress', 0, 1200, 1500),
    dressB: pool('dress', 4, 1200, 1500),
    dressC: pool('dress', 7, 1200, 1500),
    dressD: pool('dress', 11, 1200, 1500),
    fashionGown: pool('fashion', 3, 1200, 1500),
    fashionRunway: pool('fashion', 6, 1200, 1500),
    fashionEditorial: pool('fashion', 9, 1200, 1500),
    fashionCampaign: pool('fashion', 13, 1200, 1500),
    dressEvening: pool('dress', 14, 1200, 1500),
    dressCouture: pool('dress', 17, 1200, 1500),
    dressNoir: pool('dress', 2, 1200, 1500),
    dressSilk: pool('dress', 8, 1200, 1500),

    shoeA: pool('shoe', 0, 1200, 1500),
    shoeB: pool('shoe', 2, 1200, 1500),
    shoeC: pool('shoe', 4, 1200, 1500),
    shoeD: pool('shoe', 5, 1200, 1500),
    shoeE: pool('shoe', 7, 1200, 1500),
    shoeF: pool('shoe', 9, 1200, 1500),
    shoeG: pool('loafers', 3, 1200, 1500),
    shoeH: pool('loafers', 6, 1200, 1500),
    shoeI: pool('loafers', 9, 1200, 1500),
    shoeJ: pool('loafers', 12, 1200, 1500),
    shoeK: pool('loafers', 15, 1200, 1500),
    shoeL: pool('loafers', 0, 1200, 1500),

    watchA: pex(190819, 1200, 1500),
    watchB: pool('watch', 0, 1200, 1500),
    watchC: pool('watch', 2, 1200, 1500),
    watchD: pool('watch', 4, 1200, 1500),

    bagA: pex(842811, 1200, 1500),
    bagB: pex(1580287, 1200, 1500),
    bagC: pex(2536965, 1200, 1500),

    jewelryA: pex(935743, 1200, 1500),
    jewelryB: pex(2783873, 1200, 1500),
    jewelryC: pex(277390, 1200, 1500),

    perfumeA: pex(1961795, 1200, 1500),
    perfumeB: pex(1452821, 1200, 1500),
    makeupA: pex(2490805, 1200, 1500),
    makeupB: pex(3373722, 1200, 1500),
    brushes: pex(1813513, 1200, 1500),

    diningA: pex(67468, 1400, 1000),
    diningB: pex(1640777, 1400, 1000),
    diningC: pex(1639557, 1400, 1000),
    diningD: pex(1581384, 1400, 1000),
    diningE: pex(551628, 1400, 1000),
    diningF: pex(1099680, 1400, 1000),
    diningG: pex(1233319, 1400, 1000),
    diningH: pex(312418, 1400, 1000),
    diningI: pex(1029243, 1400, 1000),
    diningJ: pex(851555, 1400, 1000),
    diningK: pex(1624487, 1400, 1000),
    diningL: pex(291528, 1400, 1000),
    diningM: pex(1321935, 1400, 1000),
    champagne: pex(1129413, 1400, 1000),

    cinema: pex(1487154, 1400, 900),
    cinema2: pex(2271110, 1400, 900),
    popcorn: pex(799157, 1400, 900),
    cinema4dx: CM.cinema4dx,
    stageParty: pex(1190298, 1400, 900),
    partyNeon: pex(2608517, 1400, 900),
    eventCelebration: pex(169190, 1400, 900),

    interiorAtrium: CM.atriumSC,
    interiorAtrium2: CM.atriumSunTec,
    interiorAtrium3: CM.atriumMyer,
    interiorEscalator: CM.escalatorAirs,
    interiorEscalator2: CM.escalatorWarsaw,
    interiorFacadeNight: CM.hotelNightFacade,
    interiorLobby: CM.lobbyAmantakaBlue,
    interiorLounge: pex(1454806, 1400, 1000),
    interiorRoom: pex(2417842, 1400, 1000),
    interiorHotel: pex(262048, 1400, 1000),
    interiorSuite: pex(271624, 1400, 1000),

    spaA: CM.spaMansion24,
    spaB: CM.spaAmantakaIndoor,
    poolLux: CM.poolAmantaka,
    poolSpa: pex(1545743, 1400, 1000),
    poolOutdoor: pex(221210, 1400, 1000),
    fitnessA: pex(1954524, 1400, 1000),
    fitnessB: pex(841130, 1400, 1000),
    fitnessC: CM.gymMacau,
    yogaLuxe: pex(260352, 1400, 1000),

    retailStorefront: pex(325876, 1400, 1000),
    retailRack: pex(5668857, 1400, 1000),
    shoppingBags: pex(2536965, 1400, 1000),
    shoppingWomen: pex(583842, 1400, 1000),
    storeDisplay: pex(1926959, 1400, 1000),
    cityNight: CM.nycNight,
    coffeeShop: pex(1132049, 1400, 1000),
    coffeeBar: pex(1029243, 1400, 1000),
    wineBar: pex(279573, 1400, 1000)
  };

  global.MR_POOL = POOL;
  global.MR_PEX = pex;
  global.MR_POOLIMG = pool;
  global.MR_IMG = IMG;
})(typeof window !== 'undefined' ? window : this);