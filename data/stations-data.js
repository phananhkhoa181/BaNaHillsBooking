// ===================================
// Ba Na Hills Stations & Zones Data
// Based on official map structure
// ===================================

export const ZONES = {
    EARTH: {
        id: 'earth',
        code: 'C',
        name: 'Vùng Trái Đất',
        nameEn: 'Land of the Earth',
        color: '#27AE60',
        description: 'Khu vực chân núi - Điểm xuất phát với các ga cáp treo'
    },
    MOON_B1: {
        id: 'moon_b1',
        code: 'B1',
        name: 'Vùng Mặt Trăng (B1)',
        nameEn: 'Land of the Moon (B1)',
        color: '#3498DB',
        description: 'Khu trung tâm phía Tây - Làng Pháp và các điểm vui chơi'
    },
    MOON_B2: {
        id: 'moon_b2',
        code: 'B2',
        name: 'Vùng Mặt Trăng (B2)',
        nameEn: 'Land of the Moon (B2)',
        color: '#2980B9',
        description: 'Khu trung tâm phía Đông - Khu giải trí và nhà hàng'
    },
    SUN: {
        id: 'sun',
        code: 'A',
        name: 'Vùng Mặt Trời',
        nameEn: 'Land of the Sun',
        color: '#F39C12',
        description: 'Đỉnh Bà Nà - Cầu Vàng, Fantasy Park, Lâu đài Mặt Trăng'
    }
};

// Stations configuration based on the official map
// Chỉ các GA CÁP TREO chính để khách du lịch di chuyển

export const STATIONS = [
    // ========================================
    // VÙNG C - TRÁI ĐẤT (Land of the Earth) 
    // CHỈ CÓ 4 GA XUẤT PHÁT Ở CHÂN NÚI
    // ========================================
    
    {
        id: 'hoian',
        code: 'C-1',
        name: 'Ga Hội An',
        nameEn: 'Hoi An Station',
        zone: 'earth',
        level: 0,
        elevation: 200,
        type: 'departure',
        description: 'Ga xuất phát → Ga Marseille',
        landmarks: []
    },
    {
        id: 'suoimo',
        code: 'C-2',
        name: 'Ga Suối Mơ',
        nameEn: 'Suoi Mo Station',
        zone: 'earth',
        level: 0,
        elevation: 150,
        type: 'departure',
        description: 'Ga xuất phát → Ga Bà Nà (tuyến dài nhất)',
        landmarks: []
    },
    {
        id: 'thactoctien',
        code: 'C-3',
        name: 'Ga Thác Tóc Tiên',
        nameEn: 'Thac Toc Tien Station',
        zone: 'earth',
        level: 0,
        elevation: 180,
        type: 'departure',
        description: 'Ga xuất phát → Ga L\'Indochine',
        landmarks: []
    },
    {
        id: 'champa_departure',
        code: 'C-4',
        name: 'Ga Champa',
        nameEn: 'Champa Departure Station',
        zone: 'earth',
        level: 0,
        elevation: 220,
        type: 'departure',
        description: 'Ga xuất phát → Ga Taiga',
        landmarks: []
    },
    {
        id: 'debay_departure',
        code: 'C-5',
        name: 'Ga Debay',
        nameEn: 'Debay Departure Station',
        zone: 'earth',
        level: 0,
        elevation: 210,
        type: 'departure',
        description: 'Ga xuất phát → Ga Morin',
        landmarks: []
    },

    // ========================================
    // VÙNG B1 - MẶT TRĂNG (Land of the Moon - Khu B1)
    // Khu Làng Pháp và các nhà hàng
    // ========================================
    
    {
        id: 'marseille',
        code: 'B2-4',
        name: 'Ga Marseille',
        nameEn: 'Marseille Station',
        zone: 'moon_b2',
        level: 1,
        elevation: 950,
        type: 'destination',
        description: 'Điểm đến từ Hội An, có thể quay về',
        landmarks: ['Làng Pháp', 'Nhà hàng Marseille', 'Quảng trường', 'Hoa viên Debay']
    },
    {
        id: 'bana',
        code: 'B1-2',
        name: 'Ga Bà Nà',
        nameEn: 'Ba Na Station',
        zone: 'moon_b1',
        level: 1,
        elevation: 1000,
        type: 'destination',
        description: 'Điểm đến từ Ga Suối Mơ (tuyến dài nhất)',
        landmarks: ['Trung tâm thương mại', 'Nhà hàng', 'Khu vui chơi', 'Khách sạn']
    },
    {
        id: 'lindochine',
        code: 'A-5',
        name: 'Ga L\'Indochine',
        nameEn: 'L\'Indochine Station',
        zone: 'sun',
        level: 2,
        elevation: 1380,
        type: 'destination',
        description: 'Ga xuống về Thác Tóc Tiên',
        landmarks: ['Nhà hàng L\'Indochine', 'Vườn hoa Le Jardin', 'Điểm check-in']
    },
    {
        id: 'louvre',
        code: 'B1-4',
        name: 'Ga Louvre',
        nameEn: 'Louvre Station',
        zone: 'moon_b1',
        level: 1,
        elevation: 960,
        type: 'transit',
        description: 'Ga nội bộ → Ga Bordeaux',
        landmarks: ['Bảo tàng Louvre', 'Vườn tượng', 'Nhà hàng nghệ thuật']
    },

    // ========================================
    // VÙNG B2 - MẶT TRĂNG (Land of the Moon - Khu B2)
    // Khu vui chơi và Beer Plaza
    // ========================================
    
    {
        id: 'taiga',
        code: 'A-6',
        name: 'Ga Taiga',
        nameEn: 'Taiga Station',
        zone: 'sun',
        level: 2,
        elevation: 1420,
        type: 'destination',
        description: 'Ga xuống về Champa',
        landmarks: ['Beer Plaza', 'Khu giải trí', 'Nhà hàng Taiga', 'Khu vui chơi']
    },
    {
        id: 'bordeaux',
        code: 'B2-2',
        name: 'Ga Bordeaux',
        nameEn: 'Bordeaux Station',
        zone: 'moon_b2',
        level: 1,
        elevation: 970,
        type: 'transit',
        description: 'Ga nội bộ kết nối B1 ↔ B2',
        landmarks: ['Nhà hàng Bordeaux', 'Hầm rượu vang', 'Quán cà phê']
    },
    {
        id: 'morin',
        code: 'A-7',
        name: 'Ga Morin',
        nameEn: 'Morin Station',
        zone: 'sun',
        level: 2,
        elevation: 1390,
        type: 'destination',
        description: 'Ga xuống về Debay',
        landmarks: ['Khách sạn Morin', 'Nhà hàng', 'Khu nghỉ dưỡng', 'Vườn nhiệt đới']
    },

    // ========================================
    // VÙNG A - MẶT TRỜI (Land of the Sun)
    // Đỉnh Bà Nà - Các điểm tham quan chính
    // ========================================
    
    {
        id: 'cauang',
        code: 'A-1',
        name: 'Cầu Vàng',
        nameEn: 'Golden Bridge',
        zone: 'sun',
        level: 2,
        elevation: 1400,
        type: 'destination',
        description: 'Biểu tượng nổi tiếng với đôi bàn tay khổng lồ',
        landmarks: [
            '① Lâu Đài Mặt Trăng',
            '② Trung Tâm Giải Trí',
            '③ Kỳ Quan',
            '④ Quảng Trường Hoa'
        ],
        isLandmark: true
    },
    {
        id: 'fantasy_park',
        code: 'A-2',
        name: 'Fantasy Park',
        nameEn: 'Fantasy Park',
        zone: 'sun',
        level: 2,
        elevation: 1450,
        type: 'destination',
        description: 'Công viên giải trí trong nhà lớn nhất Việt Nam',
        landmarks: [
            '⑦ Fantasy Park',
            'Trò chơi trong nhà',
            'Khu vui chơi trẻ em'
        ],
        isLandmark: true
    },
    {
        id: 'linhung',
        code: 'A-3',
        name: 'Ga Linh Ứng',
        nameEn: 'Linh Ung Station',
        zone: 'sun',
        level: 2,
        elevation: 1500,
        type: 'destination',
        description: 'Chùa Linh Ứng với tượng Phật cao 27m',
        landmarks: [
            '⑰ Chùa Linh Ứng',
            '⑱ Tượng Phật 27m',
            'Khu linh thiêng'
        ],
        isLandmark: true
    }
];

// Cable car routes connecting stations
// Các tuyến cáp treo chính theo lịch trình thực tế

export const ROUTES = [
    // ========================================
    // VÙNG TRÁI ĐẤT (C) - CHỈ CÓ 5 TUYẾN
    // 4 tuyến lên + 1 tuyến xuống
    // ========================================
    
    {
        id: 'route_hoian_marseille',
        name: 'Hội An - Marseille',
        displayName: 'Ga Hội An → Ga Marseille',
        from: 'hoian',
        to: 'marseille',
        fromZone: 'earth',
        toZone: 'moon_b2',
        distance: 5200,
        duration: 18,
        type: 'upward',
        color: '#E67E22',
        description: 'Tuyến lên Làng Pháp'
    },
    {
        id: 'route_suoimo_bana',
        name: 'Suối Mơ - Bà Nà',
        displayName: 'Ga Suối Mơ → Ga Bà Nà',
        from: 'suoimo',
        to: 'bana',
        fromZone: 'earth',
        toZone: 'moon_b1',
        distance: 5801,
        duration: 20,
        type: 'upward',
        color: '#E67E22',
        description: 'Tuyến cáp treo dài nhất',
        isLongest: true
    },
    {
        id: 'route_thactoctien_lindochine',
        name: 'Thác Tóc Tiên - L\'Indochine',
        displayName: 'Ga Thác Tóc Tiên → Ga L\'Indochine',
        from: 'thactoctien',
        to: 'lindochine',
        fromZone: 'earth',
        toZone: 'sun',
        distance: 4800,
        duration: 16,
        type: 'upward',
        color: '#E67E22',
        description: 'Tuyến lên nhà hàng L\'Indochine'
    },
    {
        id: 'route_champa_taiga',
        name: 'Champa - Taiga',
        displayName: 'Ga Champa → Ga Taiga',
        from: 'champa_departure',
        to: 'taiga',
        fromZone: 'earth',
        toZone: 'sun',
        distance: 5000,
        duration: 17,
        type: 'upward',
        color: '#D35400',
        description: 'Tuyến lên Beer Plaza'
    },
    {
        id: 'route_debay_morin',
        name: 'Debay - Morin',
        displayName: 'Ga Debay → Ga Morin',
        from: 'debay_departure',
        to: 'morin',
        fromZone: 'earth',
        toZone: 'sun',
        distance: 4900,
        duration: 16,
        type: 'upward',
        color: '#D35400',
        description: 'Tuyến lên Khách sạn Morin'
    },
    {
        id: 'route_bana_suoimo',
        name: 'Bà Nà - Suối Mơ',
        displayName: 'Ga Bà Nà → Ga Suối Mơ',
        from: 'bana',
        to: 'suoimo',
        fromZone: 'moon_b1',
        toZone: 'earth',
        distance: 5801,
        duration: 20,
        type: 'downward',
        color: '#E67E22',
        description: 'Tuyến xuống về Suối Mơ (Duy nhất có lượt về)',
        isLongest: true
    },

    // ========================================
    // VÙNG MẶT TRĂNG B1 - TUYẾN NỘI BỘ
    // ========================================
    {
        id: 'route_louvre_bordeaux',
        name: 'Louvre - Bordeaux',
        displayName: 'Ga Louvre → Ga Bordeaux (B1→B2)',
        from: 'louvre',
        to: 'bordeaux',
        fromZone: 'moon_b1',
        toZone: 'moon_b2',
        distance: 1200,
        duration: 5,
        type: 'internal',
        color: '#8E44AD',
        description: 'Tuyến nội bộ từ B1 sang B2'
    },

    // ========================================
    // VÙNG MẶT TRĂNG B2 - TUYẾN XUỐNG VÀ NỘI BỘ
    // ========================================
    {
        id: 'route_bordeaux_louvre',
        name: 'Bordeaux - Louvre',
        displayName: 'Ga Bordeaux → Ga Louvre (B2→B1)',
        from: 'bordeaux',
        to: 'louvre',
        fromZone: 'moon_b2',
        toZone: 'moon_b1',
        distance: 1200,
        duration: 5,
        type: 'internal',
        color: '#8E44AD',
        description: 'Tuyến nội bộ từ B2 về B1'
    },
    {
        id: 'route_marseille_hoian_return',
        name: 'Marseille - Hội An',
        displayName: 'Ga Marseille → Ga Hội An',
        from: 'marseille',
        to: 'hoian',
        fromZone: 'moon_b2',
        toZone: 'earth',
        distance: 5200,
        duration: 18,
        type: 'downward',
        color: '#E67E22',
        description: 'Tuyến xuống về Hội An'
    },

    // ========================================
    // VÙNG MẶT TRỜI (A) - TUYẾN XUỐNG
    // ========================================
    {
        id: 'route_morin_debay',
        name: 'Morin - Debay',
        displayName: 'Ga Morin → Ga Debay',
        from: 'morin',
        to: 'debay_departure',
        fromZone: 'sun',
        toZone: 'earth',
        distance: 4900,
        duration: 16,
        type: 'downward',
        color: '#F39C12',
        description: 'Tuyến xuống về Debay'
    },
    {
        id: 'route_lindochine_thactoctien',
        name: 'L\'Indochine - Thác Tóc Tiên',
        displayName: 'Ga L\'Indochine → Ga Thác Tóc Tiên',
        from: 'lindochine',
        to: 'thactoctien',
        fromZone: 'sun',
        toZone: 'earth',
        distance: 4800,
        duration: 16,
        type: 'downward',
        color: '#E67E22',
        description: 'Tuyến xuống về Thác Tóc Tiên'
    },
    {
        id: 'route_taiga_champa',
        name: 'Taiga - Champa',
        displayName: 'Ga Taiga → Ga Champa',
        from: 'taiga',
        to: 'champa_departure',
        fromZone: 'sun',
        toZone: 'earth',
        distance: 5000,
        duration: 17,
        type: 'downward',
        color: '#D35400',
        description: 'Tuyến xuống về Champa'
    }
];

/**
 * Get all stations in a specific zone
 */
export function getStationsByZone(zoneId) {
    return STATIONS.filter(station => station.zone === zoneId);
}

/**
 * Get station by ID
 */
export function getStationById(stationId) {
    return STATIONS.find(station => station.id === stationId);
}

/**
 * Get routes from a station
 */
export function getRoutesFromStation(stationId) {
    return ROUTES.filter(route => route.from === stationId);
}

/**
 * Get routes to a station
 */
export function getRoutesToStation(stationId) {
    return ROUTES.filter(route => route.to === stationId);
}

/**
 * Get all possible destinations from a zone
 */
export function getDestinationsFromZone(zoneId) {
    const stationsInZone = getStationsByZone(zoneId);
    const destinations = new Set();
    
    stationsInZone.forEach(station => {
        const routes = getRoutesFromStation(station.id);
        routes.forEach(route => {
            const destStation = getStationById(route.to);
            if (destStation) {
                destinations.add({
                    zone: destStation.zone,
                    station: destStation,
                    route: route
                });
            }
        });
    });
    
    return Array.from(destinations);
}

export default {
    ZONES,
    STATIONS,
    ROUTES,
    getStationsByZone,
    getStationById,
    getRoutesFromStation,
    getRoutesToStation,
    getDestinationsFromZone
};
