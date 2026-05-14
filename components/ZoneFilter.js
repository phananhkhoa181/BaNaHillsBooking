// ===================================
// Zone Filter Component
// Displays current zone and available routes
// ===================================

import { 
    ZONES, 
    STATIONS,
    ROUTES,
    getStationsByZone,
    getRoutesFromStation,
    getStationById 
} from '../data/stations-data.js';

class ZoneFilter {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.currentZone = options.defaultZone || 'earth'; // Start from Land of the Earth (C)
        this.onRouteSelect = options.onRouteSelect || (() => {});
        
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    /**
     * Render the zone filter UI
     */
    render() {
        const zone = ZONES[this.currentZone.toUpperCase()];
        
        // Lấy tất cả stations liên quan đến zone hiện tại
        // Bao gồm: stations trong zone + stations đích của routes từ zone này
        const relatedStations = this.getRelatedStations(this.currentZone);
        
        // Build HTML
        const html = `
            <div class="zone-filter-container">
                <!-- Current Zone Header -->
                <div class="zone-header" style="border-left: 4px solid ${zone.color}">
                    <div class="zone-icon" style="background: ${zone.color}20;">
                        <i class="fas fa-map-marker-alt" style="color: ${zone.color}"></i>
                    </div>
                    <div class="zone-info">
                        <div class="zone-code" style="background: ${zone.color}; color: white;">
                            ${zone.code}
                        </div>
                        <h3 class="zone-title">${zone.name}</h3>
                        <p class="zone-subtitle">${zone.nameEn}</p>
                        <p class="zone-description">${zone.description}</p>
                    </div>
                    <div class="zone-stats">
                        <div class="stat">
                            <span class="stat-number">${relatedStations.length}</span>
                            <span class="stat-label">Trạm cáp treo</span>
                        </div>
                    </div>
                </div>

                <!-- Stations in Current Zone -->
                <div class="stations-section">
                    <h4 class="section-subtitle">
                        <i class="fas fa-train"></i>
                        Các ga cáp treo liên quan đến ${zone.name}
                    </h4>
                    <div class="stations-grid">
                        ${this.renderStations(relatedStations)}
                    </div>
                </div>

                <!-- Available Routes -->
                <div class="routes-section">
                    <h4 class="routes-title">
                        <i class="fas fa-route"></i>
                        Các tuyến cáp treo từ ${zone.name}
                    </h4>
                    ${this.renderRoutes(relatedStations)}
                </div>

                <!-- Zone Selector -->
                <div class="zone-selector">
                    <label>
                        <i class="fas fa-exchange-alt"></i>
                        Chuyển đến vùng khác:
                    </label>
                    <div class="zone-buttons">
                        ${this.renderZoneButtons()}
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    /**
     * Get all stations related to a zone
     * Chỉ hiển thị: ga có routes xuất phát từ zone này + ga đích của những routes đó
     * Loại trừ: routes khứ hồi từ B1/B2 về C (đã hiển thị ở Vùng Trái Đất)
     */
    getRelatedStations(zoneId) {
        const relatedStationIds = new Set();
        
        // Lấy tất cả routes xuất phát từ zone này
        let routesFromZone = ROUTES.filter(r => r.fromZone === zoneId);
        
        // Loại trừ route khứ hồi nếu không phải Vùng Trái Đất
        if (zoneId !== 'earth') {
            // Loại bỏ route Bà Nà → Suối Mơ (route khứ hồi)
            routesFromZone = routesFromZone.filter(r => 
                !(r.from === 'bana' && r.to === 'suoimo')
            );
        }
        
        // Thêm ga xuất phát và ga đích của mỗi route
        routesFromZone.forEach(route => {
            relatedStationIds.add(route.from); // Ga xuất phát
            relatedStationIds.add(route.to);   // Ga đích
        });
        
        // Convert IDs to station objects
        const relatedStations = Array.from(relatedStationIds)
            .map(id => getStationById(id))
            .filter(station => station !== undefined);
        
        return relatedStations;
    }

    /**
     * Render station cards
     */
    renderStations(stations) {
        if (stations.length === 0) {
            return '<p class="no-stations">Không có trạm trong vùng này</p>';
        }

        return stations.map(station => `
            <div class="station-card" data-station-id="${station.id}">
                <div class="station-header">
                    <div class="station-code">${station.code}</div>
                    <div class="station-type" data-type="${station.type}">
                        ${this.getStationTypeLabel(station.type)}
                    </div>
                </div>
                <div class="station-name">${station.name}</div>
                <div class="station-name-en">${station.nameEn}</div>
                <div class="station-elevation">
                    <i class="fas fa-mountain"></i>
                    <span>${station.elevation}m</span>
                </div>
                ${station.description ? `
                    <div class="station-description">${station.description}</div>
                ` : ''}
                ${station.landmarks && station.landmarks.length > 0 ? `
                    <div class="station-landmarks">
                        <div class="landmarks-title">
                            <i class="fas fa-star"></i>
                            Điểm nổi bật:
                        </div>
                        ${station.landmarks.slice(0, 2).map(landmark => 
                            `<span class="landmark-tag">${landmark}</span>`
                        ).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    /**
     * Get station type label
     */
    getStationTypeLabel(type) {
        const labels = {
            'departure': '🚀 Điểm xuất phát',
            'transit': '🔄 Ga trung chuyển',
            'destination': '⭐ Điểm đến'
        };
        return labels[type] || type;
    }

    /**
     * Render available routes from current zone
     */
    renderRoutes(stations) {
        // Lọc tất cả routes xuất phát từ zone hiện tại (theo fromZone)
        let allRoutes = ROUTES.filter(route => route.fromZone === this.currentZone)
            .map(route => ({
                ...route,
                fromStation: getStationById(route.from),
                toStation: getStationById(route.to)
            }));

        // Loại trừ route khứ hồi nếu không phải Vùng Trái Đất
        if (this.currentZone !== 'earth') {
            allRoutes = allRoutes.filter(r => 
                !(r.from === 'bana' && r.to === 'suoimo')
            );
        }

        if (allRoutes.length === 0) {
            return `<p class="no-routes">Không có tuyến cáp treo từ khu vực này</p>`;
        }

        // Phân loại routes theo type
        const roundTripPair = this.getRoundTripRoute(allRoutes);
        const upwardRoutes = allRoutes.filter(r => 
            r.type === 'upward' && 
            !(r.from === 'suoimo' && r.to === 'bana') // Loại trừ route khứ hồi
        );
        const downwardRoutes = allRoutes.filter(r => 
            r.type === 'downward' && 
            !(r.from === 'bana' && r.to === 'suoimo') // Loại trừ route khứ hồi
        );
        const internalRoutes = allRoutes.filter(r => r.type === 'internal');

        // Debug logging
        console.log('🔍 Current Zone:', this.currentZone);
        console.log('🔍 All routes from this zone:', allRoutes);
        console.log('🔄 Round trip pair:', roundTripPair);
        console.log('⬆️ Upward routes:', upwardRoutes);
        console.log('⬇️ Downward routes:', downwardRoutes);
        console.log('🔄 Internal routes:', internalRoutes);

        let html = '';

        // Render round-trip route (chỉ có ở Vùng Trái Đất)
        if (roundTripPair && this.currentZone === 'earth') {
            html += `
                <div class="route-section paired-routes">
                    <h4 class="section-title">
                        <i class="fas fa-exchange-alt"></i>
                        Tuyến Khứ Hồi (1 tuyến)
                    </h4>
                    ${this.renderRoutePair(roundTripPair)}
                </div>
            `;
        }

        // Render upward routes (tuyến đi lên - chỉ có ở Vùng Trái Đất)
        if (upwardRoutes.length > 0) {
            html += `
                <div class="route-section oneway-routes">
                    <h4 class="section-title">
                        <i class="fas fa-arrow-up"></i>
                        Tuyến Đi (Lên) - ${upwardRoutes.length} tuyến
                    </h4>
                    <div class="route-group upward">
                        ${upwardRoutes.map(route => this.renderRouteCard(route)).join('')}
                    </div>
                </div>
            `;
        }

        // Render downward routes (tuyến đi xuống - có ở các vùng khác)
        if (downwardRoutes.length > 0) {
            html += `
                <div class="route-section downward-routes">
                    <h4 class="section-title">
                        <i class="fas fa-arrow-down"></i>
                        Tuyến Xuống (Về) - ${downwardRoutes.length} tuyến
                    </h4>
                    <div class="route-group downward">
                        ${downwardRoutes.map(route => this.renderRouteCard(route)).join('')}
                    </div>
                </div>
            `;
        }

        // Render internal routes (tuyến nội bộ)
        if (internalRoutes.length > 0) {
            html += `
                <div class="route-section internal-routes">
                    <h4 class="section-title">
                        <i class="fas fa-route"></i>
                        Di chuyển trong vùng - ${internalRoutes.length} tuyến
                    </h4>
                    <div class="route-group internal">
                        ${internalRoutes.map(route => this.renderRouteCard(route)).join('')}
                    </div>
                </div>
            `;
        }

        return html;
    }

    /**
     * Get round-trip route (Suối Mơ ↔ Bà Nà only)
     */
    getRoundTripRoute(routes) {
        const upward = routes.find(r => r.from === 'suoimo' && r.to === 'bana' && r.type === 'upward');
        
        if (!upward) return null;
        
        // Find downward route from all ROUTES (not just current zone)
        const downwardRoute = ROUTES.find(r => r.from === 'bana' && r.to === 'suoimo' && r.type === 'downward');
        
        if (downwardRoute) {
            // Build complete route object with station info
            const downward = {
                ...downwardRoute,
                fromStation: getStationById(downwardRoute.from),
                toStation: getStationById(downwardRoute.to)
            };
            
            console.log('✅ Found round trip!', { upward, downward });
            return { upward, downward };
        }
        
        console.warn('⚠️ Downward route not found in ROUTES');
        return null;
    }

    /**
     * Render route pair (upward + downward)
     */
    renderRoutePair(pair) {
        const { upward, downward } = pair;
        const mainRoute = upward || downward;
        
        return `
            <div class="route-pair" data-pair-id="${mainRoute.id}">
                ${upward ? `
                    <div class="route-direction outbound">
                        <div class="direction-label">
                            <i class="fas fa-arrow-up"></i>
                            <span>Lượt đi (Lên)</span>
                        </div>
                        ${this.renderRouteCard(upward, 'compact')}
                    </div>
                ` : ''}
                
                ${downward ? `
                    <div class="route-direction return">
                        <div class="direction-label">
                            <i class="fas fa-arrow-down"></i>
                            <span>Lượt về (Xuống)</span>
                        </div>
                        ${this.renderRouteCard(downward, 'compact')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render individual route card
     */
    renderRouteCard(route, mode = 'full') {
        const destZone = ZONES[route.toStation.zone.toUpperCase()] || ZONES.EARTH;
        
        return `
            <div class="route-card" data-route-id="${route.id}" style="border-left: 4px solid ${route.color || destZone.color}">
                <div class="route-header">
                    <span class="route-name">${route.displayName || route.name}</span>
                    ${route.isLongest ? '<span class="route-badge longest">🏆 Dài nhất</span>' : ''}
                </div>
                
                <div class="route-path">
                    <div class="route-station from">
                        <span class="station-code">${route.fromStation.code}</span>
                        <span class="station-name">${route.fromStation.name}</span>
                    </div>
                    <div class="route-arrow">
                        <i class="fas fa-long-arrow-alt-right"></i>
                    </div>
                    <div class="route-station to">
                        <span class="station-code">${route.toStation.code}</span>
                        <span class="station-name">${route.toStation.name}</span>
                    </div>
                </div>
                
                ${route.via && route.via.length > 0 ? `
                    <div class="route-via">
                        <i class="fas fa-route"></i>
                        <span>Qua: </span>
                        ${route.via.map(stationId => {
                            const viaStation = getStationById(stationId);
                            return viaStation ? `<span class="via-station">${viaStation.name}</span>` : '';
                        }).join(', ')}
                    </div>
                ` : ''}

                ${route.description ? `
                    <div class="route-description">
                        <i class="fas fa-info-circle"></i>
                        ${route.description}
                    </div>
                ` : ''}

                <div class="route-info">
                    <span class="route-distance">
                        <i class="fas fa-ruler"></i>
                        ${route.distance}m
                    </span>
                    <span class="route-duration">
                        <i class="fas fa-clock"></i>
                        ~${route.duration} phút
                    </span>
                    <span class="route-destination" style="background: ${destZone.color}20; color: ${destZone.color}">
                        <i class="fas fa-map-marker-alt"></i>
                        → ${destZone.name}
                    </span>
                </div>

                <button class="btn-select-route" data-route-id="${route.id}" style="background: ${route.color || destZone.color}">
                    <i class="fas fa-ticket-alt"></i>
                    Lấy số thứ tự tuyến này
                </button>
            </div>
        `;
    }

    /**
     * Render zone selector buttons
     */
    renderZoneButtons() {
        return Object.entries(ZONES).map(([key, zone]) => {
            const isActive = zone.id === this.currentZone;
            // Đếm số ga liên quan (related stations) thay vì chỉ ga thuộc zone
            const stationCount = this.getRelatedStations(zone.id).length;
            
            return `
                <button 
                    class="zone-btn ${isActive ? 'active' : ''}" 
                    data-zone="${zone.id}"
                    style="border-color: ${zone.color}; ${isActive ? `background: ${zone.color}; color: white;` : `color: ${zone.color}`}"
                >
                    <div class="zone-btn-code" style="${!isActive ? `background: ${zone.color}20; color: ${zone.color};` : 'background: rgba(255,255,255,0.2); color: white;'}">
                        ${zone.code}
                    </div>
                    <span class="zone-btn-name">${zone.name}</span>
                    <span class="zone-btn-count">${stationCount} ga cáp treo</span>
                </button>
            `;
        }).join('');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Zone selector
        this.container.querySelectorAll('.zone-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const zone = e.currentTarget.dataset.zone;
                this.setZone(zone);
            });
        });

        // Route selection
        this.container.querySelectorAll('.btn-select-route').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const routeId = e.currentTarget.dataset.routeId;
                this.selectRoute(routeId);
            });
        });
    }

    /**
     * Set current zone
     */
    setZone(zoneId) {
        this.currentZone = zoneId;
        this.render();
        this.attachEventListeners();
        
        // Auto scroll to top of zone filter
        setTimeout(() => {
            this.container.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }

    /**
     * Select a route
     */
    selectRoute(routeId) {
        const route = ROUTES.find(r => r.id === routeId);
        if (route) {
            this.onRouteSelect(route);
        }
    }

    /**
     * Get current zone
     */
    getCurrentZone() {
        return this.currentZone;
    }
}

export default ZoneFilter;
