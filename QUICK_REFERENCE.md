# 🚀 Quick Reference Card - New Features

## 📌 Feature Overview

| Feature | Location | Purpose |
|---------|----------|---------|
| **Time Slot Dropdown** | Above room cards | Select time to check availability |
| **Room Search Bar** | Next to time dropdown | Filter rooms by name |
| **Free Rooms Toggle** | Below search bar | Hide booked rooms |
| **Color Coding** | Room cards | Visual availability status |
| **Active Filters** | Below toggle | Show applied filters |
| **API Endpoint** | `/api/bookings/availability` | Get booked rooms |

---

## 🎨 Color Legend

| Color | Meaning | When |
|-------|---------|------|
| 🟢 **Green** (#33CC66) | Room is FREE | Time slot selected |
| 🔴 **Red** (#FF4C4C) | Room is BOOKED | Time slot selected |
| ⚪ **Gray** (#1F2937) | Neutral/Default | No time slot selected |
| 🔵 **Blue** (#3B82F6) | Room selected | User clicked room |

---

## ⚙️ State Variables

```javascript
// New states added to HomePage.jsx
const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
const [roomSearchQuery, setRoomSearchQuery] = useState("");
const [showOnlyFreeRooms, setShowOnlyFreeRooms] = useState(false);
const [bookedRoomIds, setBookedRoomIds] = useState([]);
```

---

## 🔌 API Usage

### Endpoint
```
GET /api/bookings/availability
```

### Parameters
```javascript
{
  date: "YYYY-MM-DD",  // Required
  time: "HH:MM-HH:MM"  // Required (e.g., "9:00-10:00")
}
```

### Response
```javascript
{
  date: "2025-11-13",
  time: "9:00-10:00",
  bookedRooms: ["E003", "E101", "E138"],
  count: 3
}
```

### Frontend Call
```javascript
const fetchAvailability = async (date, timeSlot) => {
  const res = await fetch(
    `http://localhost:5000/api/bookings/availability?date=${date}&time=${timeSlot}`
  );
  const data = await res.json();
  setBookedRoomIds(data.bookedRooms || []);
};
```

---

## 🎯 Filter Logic

### Room Filtering (Priority Order)
```javascript
1. Type Filter      → Rooms vs Labs tab
2. Floor Filter     → Ground vs First
3. Search Filter    → Room name contains query
4. Availability     → Show/hide based on toggle
```

### Combined Filter Example
```javascript
const filteredRooms = allRooms.filter((room) => {
  // Must match tab type
  if (activeTab === "Rooms" && room.type !== "Theory") return false;
  
  // Must match floor
  if (selectedFloor === "Ground" && !room.name.startsWith("E0")) return false;
  
  // Must match search query
  if (roomSearchQuery && !room.name.includes(roomSearchQuery.toUpperCase())) 
    return false;
  
  // If toggle ON, hide booked rooms
  if (showOnlyFreeRooms && bookedRoomIds.includes(room.name)) 
    return false;
  
  return true;
});
```

---

## 🎬 User Workflows

### Workflow 1: Check Availability
```
1. Select date from date selector
2. Select time slot from dropdown
   → API call fires automatically
   → Room cards change colors
3. Green rooms are available
4. Red rooms are booked
```

### Workflow 2: Find Specific Room
```
1. Type room name in search bar (e.g., "E003")
2. Room list filters instantly
3. Select time slot to check if free
4. Green = can book, Red = already booked
```

### Workflow 3: Find Any Free Room
```
1. Select date
2. Select time slot
3. Toggle "Show Only Free Rooms" ON
4. Only green (free) rooms visible
5. Click any room to book
```

---

## 🐛 Troubleshooting Quick Fixes

### Colors Not Showing
```javascript
// Check these in order:
1. Is backend running? (node index.js)
2. Is selectedTimeSlot not empty? (console.log)
3. Is API returning data? (Network tab)
4. Are bookedRoomIds populated? (React DevTools)
```

### Toggle Not Working
```javascript
// Toggle requires time slot to be selected
if (!selectedTimeSlot) {
  // Toggle is disabled
}
```

### Search Not Filtering
```javascript
// Check case conversion
room.name.toUpperCase().includes(roomSearchQuery.toUpperCase())
```

### Empty Array from API
```javascript
// Check booking requirements:
- status must be "Approved"
- date must match exactly
- slots array must contain the time
- Example: slots: ["9:00-10:00"]
```

---

## 📱 Responsive Breakpoints

```javascript
// Tailwind breakpoints used
sm:  640px   // Small tablets
md:  768px   // Tablets
lg:  1024px  // Small laptops
xl:  1280px  // Desktops
2xl: 1536px  // Large screens

// Grid columns by breakpoint
Mobile:  2 columns
Tablet:  4 columns
Desktop: 8 columns
```

---

## 🔧 Configuration

### Time Slots Array
```javascript
const timeSlots = [
  "9:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-12:40",
  "12:00-1:00",
  "12:40-1:40",
  "1:40-2:40",
  "2:40-3:40",
  "3:40-4:40",
];
```

### Rooms Array
```javascript
const allRooms = [
  { id: 1, name: "E003", type: "Theory", color: "..." },
  { id: 12, name: "E001", type: "Lab", color: "..." },
  // ... 34 rooms total
];
```

---

## 🎨 CSS Classes Reference

### Filter Controls
```css
/* Time Slot Dropdown */
.w-full.bg-[#1F2937].border-2.border-[#374151]

/* Search Bar */
.w-full.bg-[#1F2937].border-2.border-[#374151]

/* Toggle Switch */
.w-14.h-7.rounded-full.bg-[#10B981]
```

### Room Cards
```css
/* Free Room */
.bg-[#33CC66].border-[#10B981]

/* Booked Room */
.bg-[#FF4C4C].border-[#DC2626]

/* Neutral Room */
.bg-[#1F2937].border-[#374151]

/* Selected Room */
.bg-[#3B82F6].border-[#3B82F6].ring-2.ring-[#60A5FA]
```

### Status Badges
```css
/* Free Badge */
.bg-white/90.text-[#10B981]

/* Booked Badge */
.bg-white/90.text-[#DC2626]
```

---

## 🔄 State Flow Diagram

```
┌──────────────────┐
│  User Action     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Select Time Slot │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ useEffect Trigger│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│fetchAvailability │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   API Call       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│setBookedRoomIds  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Re-render       │
│ (Colors Update)  │
└──────────────────┘
```

---

## 📦 Files Modified

```
📁 frontend/
  📁 src/
    📄 HomePage.jsx          [✏️ MODIFIED]
       - Added 4 new state variables
       - Added fetchAvailability function
       - Added filter UI components
       - Updated room card rendering
       - Updated filteredRooms logic
       - Added empty state
       - Lines changed: ~150 lines

📁 backend/
  📁 routes/
    📄 bookingRoutes.js      [✏️ MODIFIED]
       - Added /availability endpoint
       - Lines added: ~45 lines

📄 FEATURE_IMPLEMENTATION_SUMMARY.md  [✨ NEW]
📄 VISUAL_UI_GUIDE.md                [✨ NEW]
📄 TESTING_GUIDE.md                   [✨ NEW]
📄 QUICK_REFERENCE.md                 [✨ NEW]
```

---

## 🎯 Key Functions

### fetchAvailability
```javascript
// Purpose: Get booked rooms for date+time
// Called: When date or time slot changes
// Updates: bookedRoomIds state
```

### filteredRooms
```javascript
// Purpose: Filter rooms by all criteria
// Returns: Array of rooms to display
// Considers: Type, floor, search, toggle
```

### Color Determination
```javascript
// Logic:
if (selectedRoom) → Blue (selected)
else if (selectedTimeSlot) {
  if (isBooked) → Red
  else → Green
}
else → Gray (neutral)
```

---

## 🚦 Status Indicators

### Filter Active State
```javascript
// Time Slot: Blue badge
selectedTimeSlot && <Badge color="blue">{selectedTimeSlot}</Badge>

// Search: Green badge  
roomSearchQuery && <Badge color="green">Search: {roomSearchQuery}</Badge>

// Toggle: Green badge
showOnlyFreeRooms && <Badge color="green">✓ Free Only</Badge>
```

### Room Availability
```javascript
// Badge on room card
isBooked ? "BOOKED" : "FREE"

// Background color
isBooked ? "#FF4C4C" : "#33CC66"
```

---

## 💡 Pro Tips

1. **Quick Reset:** Click "Clear All" to remove all filters at once
2. **Fast Search:** Type partial names (E0, E1) to see floors
3. **Toggle First:** Select time slot, then toggle for instant free room view
4. **Check Before Booking:** Select time in dropdown before opening modal
5. **Mobile Friendly:** All features work on phones and tablets

---

## 📊 Performance Metrics

| Operation | Expected Time |
|-----------|--------------|
| API Call | < 500ms |
| Filter Update | < 100ms |
| Color Change | < 300ms (animation) |
| Search Filter | Instant (< 50ms) |
| Toggle Switch | Instant |

---

## ✅ Validation Rules

### Time Slot Selection
```javascript
✅ Can select any time from dropdown
✅ Can deselect by choosing "All Time Slots"
✅ Triggers immediate API call
✅ Updates room colors automatically
```

### Room Search
```javascript
✅ Case insensitive
✅ Partial matching
✅ No minimum characters
✅ Clears when empty
✅ Works with other filters
```

### Free Rooms Toggle
```javascript
✅ Disabled when no time slot
✅ Enabled with time slot
✅ Hides red rooms when ON
✅ Shows all rooms when OFF
✅ Smooth animation (300ms)
```

---

## 🎉 Success Criteria

✅ **Implemented:** All 6 features complete  
✅ **No Breaking Changes:** Existing UI intact  
✅ **Performance:** Fast and responsive  
✅ **Mobile Ready:** Works on all devices  
✅ **User Friendly:** Intuitive controls  
✅ **Production Ready:** Clean code, no errors  

---

## 📞 Quick Help

### Common Questions

**Q: Why is toggle disabled?**  
A: Select a time slot first

**Q: Why are all rooms gray?**  
A: Select a time slot to see colors

**Q: How do I reset filters?**  
A: Click "Clear All" button

**Q: Search not working?**  
A: Make sure you're typing room name (e.g., E003)

**Q: All rooms disappeared?**  
A: Toggle might be ON with no free rooms, or search query too specific

---

## 🔗 Related Documentation

- [FEATURE_IMPLEMENTATION_SUMMARY.md](./FEATURE_IMPLEMENTATION_SUMMARY.md) - Complete implementation details
- [VISUAL_UI_GUIDE.md](./VISUAL_UI_GUIDE.md) - UI design and mockups
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive test scenarios

---

**Version:** 1.0.0  
**Last Updated:** November 13, 2025  
**Status:** ✅ Production Ready
