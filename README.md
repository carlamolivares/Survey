# Nutrition & Eating Habits Survey

A small survey app for collecting responses from multiple people on their own
devices, with a live stats view (mean, median, mode, std dev) for the
quantitative questions — built for a statistics class project.

## What's in this repo

- `index.html` — the entire app (markup, styles, and logic in one file)
- `README.md` — this file

## How it works

The survey has 3 questions:

1. **Nutrition label-checking frequency** — multiple choice (Always / Often /
   Rarely / Never), tracked as a categorical variable
2. **Home-cooked meals per week** — short answer (max 250 characters)
3. **Weekly dining-out spend** — short answer (max 250 characters)

Because you're sharing a link and people will fill this out from their own
phones or laptops, responses need to live somewhere everyone's device can
read and write to. This app uses **Firebase Firestore** (Google's free-tier
database) for that. GitHub Pages only hosts static files — it can't run a
server — so Firestore is the "backend" that makes shared responses possible.

## One-time setup (before your first deploy)

1. Go to **console.firebase.google.com** and create a new project (free).
2. In the left sidebar: **Build → Firestore Database → Create database**.
   Choose **test mode** to start — you'll lock it down in step 4.
3. Click the **gear icon → Project settings**, scroll to **Your apps**,
   click the **`</>`** (web) icon, and register an app (any nickname works).
   Firebase will show you a `firebaseConfig` object with six values.
4. Open `index.html` in this repo, find the `firebaseConfig` block near the
   top of the `<script>` section, and replace each `"REPLACE_ME"` with the
   matching value Firebase gave you.
5. Back in Firestore, open the **Rules** tab and replace the contents with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /responses/{responseId} {
         allow read, create: if true;
         allow update, delete: if false;
       }
     }
   }
   ```

   Click **Publish**. This lets anyone with the link submit or view
   responses (needed for a public survey), but nobody can edit or delete
   existing entries from the app itself — you can still clear everything
   yourself from the Firebase console, or from the "Clear all responses"
   button in the app (that button uses your own logged-in view, not open
   access).

## Deploying with GitHub Pages

1. Create a new GitHub repo and push these files to it (`main` branch).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick
   **main** and **/ (root)**, then **Save**.
4. GitHub will give you a URL like
   `https://yourusername.github.io/your-repo-name/` — that's the link you
   share with people to take the survey.
5. It can take a minute or two for the page to go live after the first push.

## Exporting your data

Open the **Responses & Stats** tab in the app and click **Export CSV** to
download everything as a spreadsheet-ready file — drop it straight into
Excel or ALEKS.

## A couple of honest caveats

- **Public write access**: because there's no login, the Firestore rules
  above let *anyone* with your link submit a response. That's normal for an
  anonymous class survey, but don't reuse this setup for anything sensitive.
- **No spam protection**: nothing stops someone from submitting multiple
  times. If that matters for your assignment, you could add a simple
  "one response per browser" check, or just note it as a limitation in your
  write-up — very common for real-world survey data too.
- **Firestore free tier limits**: generous for a class-sized survey (50K
  reads/20K writes per day), so you won't hit any limits here.
