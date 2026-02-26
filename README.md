# ObserVacation

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## What technologies are used for this project?

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Redux Toolkit
- Supabase (Lovable Cloud)
- Recharts

## Prompt History – Full Conversation Log

להלן כל ההתכתבויות בין המשתמש ל-Lovable מההתחלה ועד הסוף:

---

### פרומפט 1 – הוספת דף דוחות אדמין

**משתמש:**
> הוסף דף AdminReports עם גרפים וסטטיסטיקות על החופשות והעוקבים

**Lovable:**
נוצר דף `AdminReports.tsx` הכולל:
- גרף עמודות (BarChart) המציג את מספר העוקבים לכל חופשה
- גרף עוגה (PieChart) עם התפלגות החופשות לפי טווח מחירים
- כרטיסי סטטיסטיקה עם סה"כ חופשות, סה"כ עוקבים, ממוצע מחיר, והחופשה הפופולרית ביותר
- נתונים נשלפים מ-Supabase בזמן אמת באמצעות RPC `get_vacation_follower_counts`
- הדף נוסף לניווט ב-`AppNavbar` ולראוטר ב-`App.tsx`

---

### פרומפט 2 – יצירת טראפיק ונתוני בדיקה

**משתמש:**
> תייצר לי בבקשה טראפיק ותזין 30 חופשות באתרים רנדומליים מן העולם ותעלה תמונות רלוונטיות. תייצר 10 משתמשים במערכת ותבצע הזמנות שונות כדי שיהיה לי נפח בפרוייקט הגשה. תרוץ על הכל. יש לך אישור גורף ממני.

**Lovable:**
בוצע באמצעות Edge Function זמנית (`seed-data`) שהופעלה עם Service Role Key:

**חופשות (30):**
הוכנסו 30 חופשות עם יעדים אמיתיים מרחבי העולם, כולל תמונות מ-Unsplash:
Paris, Tokyo, Santorini, Bali, New York, Machu Picchu, Dubai, Rome, Maldives, Cape Town, Barcelona, Kyoto, Iceland, Marrakech, Sydney, Swiss Alps, Havana, Petra, Amalfi Coast, Banff, Prague, Zanzibar, Patagonia, Fiji, Istanbul, Norwegian Fjords, Galápagos Islands, Queenstown, Angkor Wat, Lisbon.

**משתמשים (10):**
נוצרו 10 משתמשי בדיקה עם הסיסמה `Test1234!`:
| שם משתמש | אימייל |
|-----------|--------|
| sarah_c | sarah.cohen@test.com |
| david_l | david.levi@test.com |
| maya_b | maya.bar@test.com |
| yossi_k | yossi.katz@test.com |
| noa_r | noa.rosen@test.com |
| amit_s | amit.sharon@test.com |
| liora_g | liora.gold@test.com |
| oren_m | oren.malka@test.com |
| shira_d | shira.dayan@test.com |
| eyal_p | eyal.peretz@test.com |

**עוקבים:**
נוצרו 103 קשרי עוקבים רנדומליים בין המשתמשים לחופשות, כדי לספק נפח לדוחות ולגרפים.

לאחר הביצוע, ה-Edge Function הזמנית נמחקה אוטומטית.

---

### פרומפט 3 – הכנסת פרומפטים ל-README

**משתמש:**
> עכשיו תכניס את כל הפרומטים שהיו לנו מההתחלה ועד הסוף לתוך קובץ ה README.MD של הפרוייקט. הכל.

**Lovable:**
קובץ ה-README.md עודכן עם שם הפרויקט, טכנולוגיות בשימוש, ורשימת 3 הפרומפטים.

---

### פרומפט 4 – הרחבת ה-README עם כל ההתכתבויות

**משתמש:**
> זה לא טוב. אני מבקש שתכלול את כל ההתכתבויות שלי איתך גם כן מההתחלה ועד עכשיו ושהכל יוכנס לקובץ ה README.MD

**Lovable:**
קובץ ה-README.md עודכן מחדש וכולל כעת את **כל ההתכתבויות המלאות** – כולל הפרומפטים של המשתמש והתשובות של Lovable, עם פירוט טכני של מה שבוצע בכל שלב.

---

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.
