# FixIt WA 03

FixIt WA 03 helps people in Southwest Washington check whether a broken item is safe to repair, learn the fix, and find local help when it is not.

In WA-03, families are often deciding between buying new or making one more repair on a bike, a coat, a chair, or a small appliance. That can be expensive, confusing, and sometimes unsafe. This app gives people a fast first step so they can make a better choice without guessing.

What the app does:

- Lets users choose from 47 common repairs, or describe the problem (and add a photo) in the scanner
- Runs a safety check made for that kind of item and shows a green, yellow, or red result, with reasons
- Shares 32 beginner-safe repair guides with safety tips first and steps you can check off
- Compares repair cost versus replacement cost, and shows the waste a repair keeps out of the landfill
- Tracks money saved and waste avoided in a repair log and impact dashboard
- Points to verified local repair help, sorted by distance, when a DIY fix is not the right call

Why it is local:

- It is built around repair habits that matter in Southwest Washington
- It supports the small businesses and community fix-it groups people already use
- It connects repair skills to trades and apprenticeships
- It keeps useful things in use longer and keeps waste out of the landfill

Tech stack:

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Local JSON data files
- Browser localStorage for repair logs and dashboard totals
- Vitest tests that lock in the safety rules
- Optional AI photo recognition with Claude (Anthropic)