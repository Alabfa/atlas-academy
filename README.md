<div align="center">

# 🌍 Atlas Academy

**Learn world geography — countries, capitals, flags & more.**

A free, open-source geography learning app. No framework, no build step, no backend required to play.

**[🌐 Play now — alabfa.github.io/atlas-academy](https://alabfa.github.io/atlas-academy/)** · [Report a Bug](https://github.com/Alabfa/atlas-academy/issues)

![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-f7df1e)
![No Framework](https://img.shields.io/badge/Framework-None-success)
![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20AR-blue)
![Hosting](https://img.shields.io/badge/Hosting-GitHub%20Pages-orange)

</div>

---

## About

Atlas Academy is an interactive web app for learning world geography, **live and free to use**
at the link above. Browse **194 countries**, study world flags, explore the seven continents, train with flashcards, and test
yourself with **leveled, personalized quizzes**.

Everything works **entirely in your browser** — progress is saved locally. Optionally, you can
sign in with Google to sync your XP and level to the cloud and compete on a **global ranking**.

The entire interface is available in **English and Arabic** (with full RTL support).

## Features

- 🗺️ **Countries** — 194 full profiles: flag, capital, continent, region, population, area,
  currency, official languages, neighbors, and a fun fact for every country
- 🚩 **Flags** — gallery of every flag with search and continent filters
- 🧭 **Continents** — key facts (area, population, highest point, longest river) for all 7 continents
- 🃏 **Learning Mode** — 3D flip flashcards with deck filters, shuffle, and progress tracking
- 🎯 **Quizzes** — 9 categories × 3 difficulty levels + a personal **"For You"** quiz built from
  the countries you've learned
- ⭐ **XP & Levels** — 12 levels from *Beginner* to *Legend*
- 🏆 **Achievements** — 7 unlockable badges
- 🌐 **3D Earth** — a real textured globe on the home page
- 🌍 **Arabic support** — full translation of UI and data, RTL layout, Arabic typography
- 👤 **Online accounts (optional)** — Google sign-in, cloud progress sync, profile editing,
  account deletion, and a public **Global Ranking** leaderboard

## Running Locally

The live site is the recommended way to play, but the app also runs anywhere with no build step:

```bash
git clone https://github.com/Alabfa/atlas-academy.git
cd atlas-academy

# any static server works, e.g.:
python -m http.server 8000
# then open http://localhost:8000
```

Or simply open `index.html` in a browser (accounts and the ranking require Supabase config —
see below; the game itself works offline).

### Hosting Your Own Instance

The official site runs on **GitHub Pages** (deploys automatically from the `main` branch —
no build configuration needed). To run your own copy:

1. Fork this repository
2. **Settings → Pages → Deploy from branch → `main` / (root)**
3. Optionally add your own `js/config.js` (Supabase) to enable accounts and ranking —
   see the [Supabase section](#accounts--supabase-optional)

## Project Structure

```
atlas-academy/
├── index.html                ← page shell + script order
├── css/
│   └── style.css             ← all styling (incl. RTL/Arabic typography)
└── js/
    ├── config.js             ← Supabase URL + anon key (optional, see below)
    ├── data-countries.js     ← country database (add/edit countries here)
    ├── data-continents.js    ← continent facts (English)
    ├── data-arabic.js        ← Arabic translations of all data
    ├── data-questions.js     ← curated quiz question banks (EN + AR)
    ├── i18n.js               ← UI labels EN/AR + language switching
    ├── utils.js              ← icons, helpers, toasts
    ├── state.js              ← XP, levels, achievements, localStorage
    ├── account.js            ← Supabase auth, profile, progress sync
    ├── app.js                ← router, navigation, startup
    └── views/
        ├── home.js           ← home + recommendation strips
        ├── globe.js          ← interactive 3D Earth (three.js)
        ├── countries.js      ← country list + detail modal
        ├── flags.js          ← flag gallery
        ├── continents.js     ← continents section
        ├── learn.js          ← flashcards
        ├── quiz.js           ← quiz engine (levels, XP, review)
        ├── account.js        ← My Account page
        └── ranking.js        ← global leaderboard
```

### Quick edit map

| I want to… | Edit this file |
|---|---|
| Add/remove/change a country | `js/data-countries.js` |
| Fix an Arabic name or fact | `js/data-arabic.js` |
| Add quiz questions | `js/data-questions.js` |
| Change a button/label/message | `js/i18n.js` |
| Adjust XP or levels | `js/state.js` |
| Change how a page works | `js/views/<page>.js` |
| Colors, fonts, layout | `css/style.css` |

## Quiz System

**Categories (9):** Country → Capital · Capital → Country · Flag → Country · Country → Flag ·
Country → Continent · Continent → Countries · World Facts · Physical Geography · Random Mixed.

**Difficulty levels (3):** *Easy* draws from the world's most famous countries;
*Hard* draws from lesser-known ones **and** uses same-continent wrong answers as traps.
The app tracks your accuracy per level and **recommends** the next one on the home screen.

**"For You" quiz:** unlocks after learning 10 countries — a personal mix of your learned/viewed
countries plus your statistically weakest topic.

**XP:** +8 / +10 / +14 per correct answer (Easy / Medium / Hard), +10 quiz bonus, +25 perfect run.

**Levels (12):**

| Level | XP | Title |
|---|---|---|
| 1 | 0 | Beginner |
| 2 | 120 | Explorer |
| 3 | 300 | Navigator |
| 4 | 550 | Voyager |
| 5 | 900 | Cartographer |
| 6 | 1,400 | Geographer |
| 7 | 2,000 | Globetrotter |
| 8 | 2,800 | Trailblazer |
| 9 | 3,800 | Atlas |
| 10 | 5,000 | Earth Sage |
| 11 | 6,500 | Globe Master |
| 12 | 8,500 | Legend |

## Accounts & Supabase (optional)

Online accounts are **Google-only** and powered by Supabase. The game is fully playable without
them — local progress always works, even if Supabase is unreachable.

### 1. Configuration

Create `js/config.js` with your public values (Supabase Dashboard → Settings → API):

```js
window.ATLAS_SUPABASE = {
  url: "https://YOUR-PROJECT-REF.supabase.co",   // bare project URL, no path
  anonKey: "YOUR-SUPABASE-ANON-KEY"              // anon key is public by design
};
```

> ⚠️ **Never** place a `service_role` key in frontend code. Data safety is enforced
> server-side with Row Level Security.

### 2. Database setup

Run in the Supabase SQL Editor:

```sql
-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;

-- Leaderboard is public, but players only appear from Level 3
create policy "profiles_select_public" on public.profiles
  for select using (auth.uid() = id or level >= 3);

-- Users can only create/edit/delete their OWN row
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- Keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

-- Self-service account deletion (no privileged key in the frontend)
create or replace function public.delete_own_account()
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke execute on function public.delete_own_account() from anon, public;
grant execute on function public.delete_own_account() to authenticated;
```

### 3. Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com) → create OAuth consent screen (External).
2. Credentials → **Create OAuth client ID → Web application**.
3. Authorized redirect URI: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
4. Paste the Client ID + Secret into Supabase → **Authentication → Providers → Google** → enable.

### 4. Redirect URLs

Supabase → **Authentication → URL Configuration → Redirect URLs**, add:

- Your site's URL (e.g. `https://alabfa.github.io/atlas-academy/`)
- `http://localhost:8000/` (local development)

### 5. Ranking threshold

The leaderboard hides players below **Level 3**. This lives in two places — keep them in sync:

- `js/views/ranking.js` → `const RANK_MIN_LEVEL = 3;`
- SQL policy → `level >= 3` (in the SELECT policy above)

The server-side policy is the real enforcement — it hides below-threshold rows from everyone,
including direct API calls.

## Privacy

- All game progress is stored **locally** in your browser (`localStorage`). No account needed.
- Accounts store only: display name, username, avatar URL, XP, level, timestamps.
- The global ranking shows only that public information.
- You can reset local progress (My Account → Data & privacy) or permanently delete your
  account (with confirmation) at any time.

## Tech Stack

- **Vanilla JavaScript** — no framework, no build step, no npm
- **[three.js](https://threejs.org)** — interactive 3D Earth (home page)
- **[Supabase](https://supabase.com)** — optional auth + database + RLS
- **[flagcdn.com](https://flagpedia.net)** — flag images
- **Google Fonts** — Fraunces, Instrument Sans, IBM Plex Sans Arabic

## Credits

Created by **[Alabfa](https://github.com/Alabfa)** — designed and built through **AI-assisted
development ("vibe coding")** in collaboration with **GLM-5.3-Flash (Z.ai)**: every feature was shaped
through iterative human–AI pairing, from the quiz engine to the 3D globe.

## License

This project is open source — see the [LICENSE](LICENSE) file for details.
