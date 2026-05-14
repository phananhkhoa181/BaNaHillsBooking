# Ba Na Hills Stations Data - Corrected Structure

## ✅ Correction Summary (Based on User Requirements)

### Previous Issues:
1. ❌ Earth zone had too many stations (including intermediate stops)
2. ❌ Duplicate station IDs (champa appeared in both Earth and Moon zones)
3. ❌ Destination stations (Marseille, Bà Nà, L'Indochine, Taiga) were not correctly assigned
4. ❌ Routes referenced incorrect zone assignments

### Corrections Made:
1. ✅ Earth zone now has ONLY 4 departure stations (as specified by user)
2. ✅ All destination stations moved to correct Moon zones
3. ✅ Fixed duplicate IDs (champa_departure vs other stations)
4. ✅ Updated all routes to match correct structure
5. ✅ Simplified Sun zone to 3 main landmarks

---

## 📍 Current Station Structure

### **Vùng C - Trái Đất (Earth Zone)** - 4 Stations ONLY
**CHỈ CÓ CÁC GA XUẤT PHÁT Ở CHÂN NÚI**

| Code | Station | Type | Destination |
|------|---------|------|-------------|
| C-1 | Ga Hội An | Departure | → Ga Marseille |
| C-2 | Ga Suối Mơ | Departure | → Ga Bà Nà (longest route) |
| C-3 | Ga Thác Tóc Tiên | Departure | → Ga L'Indochine |
| C-4 | Ga Champa | Departure | → Ga Taiga |

### **Vùng B1 - Mặt Trăng (Moon Zone - Khu B1)** - 3 Stations
**KHU LÀNG PHÁP VÀ CÁC NHÀ HÀNG**

| Code | Station | Type | Description |
|------|---------|------|-------------|
| B1-1 | Ga Marseille | Arrival | From Hội An - French Village |
| B1-2 | Ga Bà Nà | Arrival | From Suối Mơ (longest route) |
| B1-3 | Ga L'Indochine | Arrival | From Thác Tóc Tiên |

### **Vùng B2 - Mặt Trăng (Moon Zone - Khu B2)** - 1 Station
**KHU VUI CHƠI VÀ BEER PLAZA**

| Code | Station | Type | Description |
|------|---------|------|-------------|
| B2-1 | Ga Taiga | Arrival | From Champa - Beer Plaza |

### **Vùng A - Mặt Trời (Sun Zone)** - 3 Stations
**ĐỈNH BÀ NÀ - CÁC ĐIỂM THAM QUAN CHÍNH**

| Code | Station | Type | Description |
|------|---------|------|-------------|
| A-1 | Cầu Vàng | Destination | Golden Bridge with giant hands |
| A-2 | Fantasy Park | Destination | Largest indoor amusement park |
| A-3 | Ga Linh Ứng | Destination | Linh Ung Pagoda with 27m Buddha |

---

## 🚡 Cable Car Routes

### **From Earth Zone (5 routes total)**

#### Upward Routes (4):
1. **Hội An → Marseille** (5200m, 18 min) - To French Village
2. **Suối Mơ → Bà Nà** (5801m, 20 min) - ⭐ LONGEST ROUTE
3. **Thác Tóc Tiên → L'Indochine** (4800m, 16 min) - To L'Indochine Restaurant
4. **Champa → Taiga** (5000m, 17 min) - To Beer Plaza

#### Downward Routes (1):
5. **Bà Nà → Suối Mơ** (5801m, 20 min) - Return route

### **Internal Moon Zone Routes (3 routes)**
- Marseille ↔ Bà Nà (800m, 5 min)
- Marseille ↔ L'Indochine (900m, 5 min)
- Bà Nà ↔ L'Indochine (700m, 4 min)

### **Moon to Sun Zone (2 routes)**
- Bà Nà → Cầu Vàng (2800m, 10 min) - Upward
- Cầu Vàng → Bà Nà (2800m, 10 min) - Downward

### **Internal Sun Zone Routes (3 routes)**
- Cầu Vàng ↔ Fantasy Park (600m, 3 min)
- Cầu Vàng ↔ Linh Ứng (1200m, 6 min)
- Fantasy Park ↔ Linh Ứng (800m, 4 min)

---

## 🎯 Key Changes from Previous Version

### Station Changes:
- **Removed** from Earth zone: Debay, Bordeaux, Tóc Tiên, Premier, Mimosa (these were incorrectly placed)
- **Added** to Moon B1: Marseille, Bà Nà, L'Indochine (destination stations)
- **Added** to Moon B2: Taiga (destination station)
- **Simplified** Sun zone: Only 3 main landmarks (Cầu Vàng, Fantasy Park, Linh Ứng)
- **Fixed** duplicate ID: `champa_departure` in Earth vs other stations

### Route Changes:
- **Removed** all old routes referencing non-existent stations (Debay, Bordeaux, etc.)
- **Created** 5 main routes from Earth zone (4 up, 1 down)
- **Simplified** internal routes to only essential connections
- **Fixed** all zone references to match corrected structure

---

## 📝 User Requirements Met

✅ **"Vùng Trái Đất có điểm bắt đầu là..."**
- Ga Hội An tới ga Marseille ✓
- Ga Suối Mơ đến ga Bà Nà ✓
- Ga Thác Tóc Tiên đến Ga L'Indochine ✓
- Ga Champa tới ga Taiga ✓
- Từ Bà Nà về lại ga Suối Mơ ✓

✅ **Only 4 departure stations in Earth zone**
✅ **Only main cable car stations for tourist movement**
✅ **Correct zone assignments: C=Earth, B1+B2=Moon, A=Sun**

---

## 📦 Total Count
- **4 Zones**: Earth (C), Moon B1 (B1), Moon B2 (B2), Sun (A)
- **11 Stations**: 4 Earth + 3 Moon B1 + 1 Moon B2 + 3 Sun
- **14 Routes**: 5 Earth + 3 Moon internal + 2 Moon-Sun + 4 Sun internal

---

**Last Updated**: Based on user correction - Earth zone structure finalized
**Status**: ✅ Ready for integration with ZoneFilter component
