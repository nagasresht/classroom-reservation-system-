# 🧪 Testing Guide - New Features

## Quick Start Testing

### 1. Start the Application

**Backend:**
```powershell
cd backend
node index.js
```
Expected output:
```
✅ MongoDB Connected
🔥 BOOKING ROUTES LOADED - Code is active!
🚀 Server running on port 5000
```

**Frontend:**
```powershell
cd frontend
npm run dev
```
Expected output:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🎯 Test Scenarios

### ✅ Test 1: Time Slot Dropdown Functionality

**Steps:**
1. Open app at `http://localhost:5173`
2. Login as faculty user
3. Navigate to Rooms tab (default)
4. Locate the "Select Time Slot" dropdown

**Expected Results:**
- ✅ Dropdown shows all time slots (9:00-10:00, 10:00-11:00, etc.)
- ✅ Default option is "All Time Slots"
- ✅ Clicking opens dropdown with all 9 time slots

**Test:**
1. Select "9:00-10:00"
2. Check console for API call: `🔍 Availability response:`
3. Verify room cards change color

**Pass Criteria:**
- Dropdown selects time slot correctly
- API call fires to `/api/bookings/availability`
- Response logged in console
- Room cards update (some green, some red, or all one color)

---

### ✅ Test 2: Room Color Coding

**Steps:**
1. Ensure you have at least one approved booking in database
2. Select a time slot that has a booking
3. Observe room card colors

**Expected Results:**
- ✅ Booked rooms show **RED background** (#FF4C4C)
- ✅ Free rooms show **GREEN background** (#33CC66)
- ✅ Small badge appears: "BOOKED" or "FREE"
- ✅ When no time slot selected, all rooms are **GRAY/NEUTRAL**

**Create Test Booking:**
```javascript
// In MongoDB or through admin panel:
{
  room: "E003",
  date: "2025-11-13", // Today's date
  slots: ["9:00-10:00"],
  status: "Approved",
  facultyName: "Test Faculty",
  email: "test@example.com",
  department: "CSE",
  staffNumber: "123",
  reason: "Test booking"
}
```

**Test:**
1. Select date: Nov 13, 2025
2. Select time: "9:00-10:00"
3. Find E003 room card
4. Verify it's RED with "BOOKED" badge

**Pass Criteria:**
- E003 is RED (booked)
- Other rooms without bookings are GREEN (free)
- Hover effects still work
- Click opens modal correctly

---

### ✅ Test 3: Room Search Bar

**Steps:**
1. Locate "Search Room" input field
2. Type different search queries

**Test Cases:**

| Input | Expected Result |
|-------|----------------|
| `E003` | Only E003 shown |
| `E0` | All E0xx rooms (E001-E038) |
| `E1` | All E1xx rooms (E101-E141) |
| `e003` | Same as E003 (case insensitive) |
| `E01` | E012, E013, E014, E015 |
| `Lab` | No results (searching by room name, not type) |
| ` ` | All rooms (empty search) |

**Pass Criteria:**
- Real-time filtering (no submit button needed)
- Case insensitive
- Partial matching works
- Clears when input is empty
- Works with other filters

---

### ✅ Test 4: Show Only Free Rooms Toggle

**Steps:**
1. **Without time slot selected:**
   - Toggle should be **DISABLED** (grayed out)
   - Cannot click it

2. **With time slot selected:**
   - Toggle becomes **ENABLED**
   - Click to turn ON
   - Verify red (booked) rooms disappear
   - Click again to turn OFF
   - Verify all rooms reappear

**Expected Results:**
- ✅ Toggle disabled when no time slot
- ✅ Toggle enabled with time slot
- ✅ When ON: Only green rooms visible
- ✅ When OFF: All rooms visible (green + red)
- ✅ Switch animates smoothly
- ✅ Label updates with time slot

**Pass Criteria:**
- Toggle state changes correctly
- Booked rooms hidden when ON
- All rooms shown when OFF
- Animation smooth (300ms transition)
- Background changes: Gray → Green

---

### ✅ Test 5: Combined Filters

**Test filtering with multiple conditions:**

**Scenario A: Time + Search**
1. Select time: "9:00-10:00"
2. Type search: "E0"
3. Expected: Only E0xx rooms, color-coded green/red

**Scenario B: Time + Toggle**
1. Select time: "2:40-3:40"
2. Toggle "Show Only Free Rooms" ON
3. Expected: Only free rooms for that time

**Scenario C: All Filters**
1. Select time: "9:00-10:00"
2. Type search: "E1"
3. Toggle ON
4. Expected: Only free E1xx rooms

**Scenario D: Search Only (No Time)**
1. Clear time slot (select "All Time Slots")
2. Type search: "E003"
3. Expected: E003 shown in neutral gray

**Pass Criteria:**
- All filters work together correctly
- No conflicts or bugs
- Room list updates in real-time
- Correct rooms shown for each combination

---

### ✅ Test 6: Active Filters Display

**Steps:**
1. Apply filters one by one
2. Observe the "Active Filters" section below toggles

**Expected Results:**
- ✅ Section only appears when filters active
- ✅ Blue badge for time slot: `[Time: 9:00-10:00]`
- ✅ Green badge for search: `[Search: E003]`
- ✅ Green badge for toggle: `[✓ Free Only]`
- ✅ "Clear All" button removes all filters

**Test:**
1. Select time slot → Badge appears
2. Type search → Second badge appears
3. Toggle ON → Third badge appears
4. Click "Clear All" → All badges disappear, filters reset

**Pass Criteria:**
- Badges appear/disappear dynamically
- Correct colors and labels
- "Clear All" resets everything
- Section hidden when no filters

---

### ✅ Test 7: Empty State

**Steps:**
1. Create conditions for empty state:

**Scenario A: No Search Results**
1. Type search: "XYZ999"
2. Expected: "No Rooms Found" message
3. Message: "No rooms match 'XYZ999'"

**Scenario B: All Booked**
1. Book all rooms for a time slot
2. Select that time slot
3. Toggle "Show Only Free Rooms" ON
4. Expected: "No Rooms Found"
5. Message: "All rooms are booked for [time]"

**Scenario C: Floor Has No Matching Rooms**
1. Search for "E1" while on Ground Floor
2. Expected: No results (E1 is First Floor)

**Expected Results:**
- ✅ Empty state container appears
- ✅ 🔍 emoji icon shown
- ✅ "No Rooms Found" heading
- ✅ Descriptive message explaining why
- ✅ "Clear Filters" button shown
- ✅ Button clears filters and shows rooms

**Pass Criteria:**
- Empty state triggers correctly
- Appropriate message for each scenario
- "Clear Filters" button works
- Design matches existing UI theme

---

### ✅ Test 8: Backend API Endpoint

**Test the availability endpoint directly:**

**Using Browser:**
```
http://localhost:5000/api/bookings/availability?date=2025-11-13&time=9:00-10:00
```

**Using curl (PowerShell):**
```powershell
curl "http://localhost:5000/api/bookings/availability?date=2025-11-13&time=9:00-10:00"
```

**Expected Response:**
```json
{
  "date": "2025-11-13",
  "time": "9:00-10:00",
  "bookedRooms": ["E003", "E101"],
  "count": 2
}
```

**Test Cases:**

1. **No bookings for date/time:**
```json
{
  "date": "2025-12-25",
  "time": "9:00-10:00",
  "bookedRooms": [],
  "count": 0
}
```

2. **Missing parameters:**
```
http://localhost:5000/api/bookings/availability
```
Expected: 400 error with message

3. **Invalid date format:**
```
http://localhost:5000/api/bookings/availability?date=invalid&time=9:00-10:00
```
Expected: Empty bookedRooms array

**Pass Criteria:**
- Returns correct booked room names
- Count matches array length
- Handles errors gracefully
- Only counts "Approved" bookings
- Ignores "Pending" and "Rejected"

---

### ✅ Test 9: Responsive Design

**Test on different screen sizes:**

**Desktop (1920px+):**
- ✅ Filters in one row (side by side)
- ✅ 8 column room grid
- ✅ All labels visible

**Tablet (768px - 1024px):**
- ✅ Filters in one row (smaller padding)
- ✅ 4 column room grid
- ✅ Labels visible

**Mobile (375px):**
- ✅ Filters stack vertically
- ✅ 2 column room grid
- ✅ Text truncates properly
- ✅ Touch targets large enough
- ✅ Toggle switch easy to tap

**Test in Chrome DevTools:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test these devices:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

**Pass Criteria:**
- No horizontal scrolling
- All elements visible and usable
- Touch targets at least 44x44px
- Text readable without zoom
- Cards maintain aspect ratio

---

### ✅ Test 10: Performance & Edge Cases

**Performance Tests:**

1. **Large Dataset:**
   - Create 50+ bookings
   - Select time slot
   - Measure response time (should be < 500ms)

2. **Rapid Filter Changes:**
   - Quickly select different time slots
   - Type and delete search queries fast
   - Toggle switch multiple times
   - Verify no lag or freezing

3. **Network Issues:**
   - Disable network (DevTools)
   - Select time slot
   - Verify error handling (console logs error)
   - Re-enable network, verify recovery

**Edge Cases:**

1. **Multiple Slots Booked:**
```javascript
// Booking with multiple slots
{
  slots: ["9:00-10:00", "10:00-11:00", "11:00-12:00"]
}
```
- Verify room marked as booked for all 3 slots

2. **Same Room, Different Times:**
- E003 booked at 9-10
- E003 free at 2-3
- Verify color changes when switching time slots

3. **Combined Rooms:**
- E012 & E013 (combined room)
- Verify search finds it with "E012" or "E013"

4. **Date Change:**
- Select Nov 13, time 9-10 (E003 booked)
- Change to Nov 14, same time (E003 free)
- Verify color updates

**Pass Criteria:**
- No crashes or freezing
- Error messages in console, not UI breaks
- State updates correctly for all cases
- Combined rooms searchable by either name

---

## 🐛 Common Issues & Solutions

### Issue 1: Colors Not Updating
**Symptoms:** Room cards stay gray after selecting time slot

**Debug Steps:**
1. Check console for API errors
2. Verify backend is running (`node index.js`)
3. Check network tab for 404 or 500 errors
4. Verify MongoDB connection

**Solution:**
```powershell
# Restart backend
cd backend
node index.js
```

---

### Issue 2: Toggle Always Disabled
**Symptoms:** Cannot click toggle switch

**Debug Steps:**
1. Check if time slot is selected
2. Verify `selectedTimeSlot` state is not empty
3. Check console for state updates

**Solution:**
- Must select a time slot first
- If still disabled, check JSX condition: `disabled={!selectedTimeSlot}`

---

### Issue 3: Search Not Working
**Symptoms:** Typing in search doesn't filter rooms

**Debug Steps:**
1. Check if `roomSearchQuery` state updates
2. Verify filter logic in `filteredRooms`
3. Check for case sensitivity issues

**Solution:**
```javascript
// Should convert to uppercase for comparison
if (!room.name.toUpperCase().includes(query))
```

---

### Issue 4: API Returns Empty Array
**Symptoms:** All rooms green even when bookings exist

**Debug Steps:**
1. Check if bookings exist: `http://localhost:5000/api/bookings`
2. Verify booking status is "Approved"
3. Check if date and time match exactly
4. Verify slots array format: `["9:00-10:00"]`

**Solution:**
```javascript
// Check booking format in MongoDB
{
  slots: ["9:00-10:00"],  // Must be array
  status: "Approved",      // Must be approved
  date: "2025-11-13"       // Must match format
}
```

---

## ✅ Final Checklist

Before marking features as complete:

- [ ] Time slot dropdown shows all slots
- [ ] Selecting time slot triggers API call
- [ ] Room cards change to green/red correctly
- [ ] Search bar filters rooms in real-time
- [ ] Toggle disabled without time slot
- [ ] Toggle hides booked rooms when ON
- [ ] Active filters display correctly
- [ ] "Clear All" button resets everything
- [ ] Empty state shows appropriate message
- [ ] Backend API returns correct data
- [ ] Works on desktop, tablet, mobile
- [ ] No console errors
- [ ] All existing features still work
- [ ] Faculty view tab not affected
- [ ] Booking flow still works
- [ ] Admin panel not affected

---

## 📊 Test Results Template

```
┌─────────────────────────────────────────────────┐
│ TEST RESULTS                                     │
├─────────────────────────────────────────────────┤
│ Test 1: Time Slot Dropdown        [ ✅ PASS ]   │
│ Test 2: Room Color Coding          [ ✅ PASS ]   │
│ Test 3: Room Search Bar            [ ✅ PASS ]   │
│ Test 4: Free Rooms Toggle          [ ✅ PASS ]   │
│ Test 5: Combined Filters           [ ✅ PASS ]   │
│ Test 6: Active Filters Display     [ ✅ PASS ]   │
│ Test 7: Empty State                [ ✅ PASS ]   │
│ Test 8: Backend API                [ ✅ PASS ]   │
│ Test 9: Responsive Design          [ ✅ PASS ]   │
│ Test 10: Performance & Edge Cases  [ ✅ PASS ]   │
├─────────────────────────────────────────────────┤
│ Total: 10/10 Tests Passed                       │
│ Status: ✅ READY FOR PRODUCTION                 │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Testing

After deploying to production:

1. **Smoke Test:**
   - Open production URL
   - Login
   - Select time slot
   - Verify colors appear

2. **Cross-Browser Test:**
   - Chrome ✅
   - Firefox ✅
   - Safari ✅
   - Edge ✅

3. **Mobile Device Test:**
   - iOS Safari
   - Android Chrome

4. **Load Test:**
   - Multiple users simultaneously
   - Check server logs for errors

---

## 📞 Support

If tests fail, check:
1. Console logs (frontend)
2. Server logs (backend)
3. MongoDB connection
4. Network tab (API calls)
5. React DevTools (state values)

All tests should pass! 🎉
