Update the existing hero carousel in my Next.js project.

File to edit:

- `src/app/page.tsx`

Project details:

- Framework: Next.js
- The carousel already exists in `src/app/page.tsx` and should be updated there, not rebuilt elsewhere unless absolutely necessary.
- The slide background images are in `src/public` and are named `slides 1` through `slides 5` (use the actual file extensions found in the project).
- Keep the implementation clean, modern, responsive, and production-ready.
- Use Next.js best practices, including `next/image` if appropriate.
- Preserve the existing styling approach used in the file/project.
- Do not change unrelated parts of the page.

What I want:

1. Update the carousel content in `src/app/page.tsx` to use 5 slides.
2. Each slide should include:
   - background image
   - overlay for text readability
   - headline
   - subheadline
   - CTA button
3. Make it mobile-friendly and visually polished.
4. If autoplay already exists, keep it. If not, add smooth autoplay with navigation controls or dots.
5. Keep the text readable over the images.
6. Return the full updated `src/app/page.tsx` code.
7. Mention any additional fixes needed if the image paths should be moved or referenced differently for Next.js.

Slides content:

Slide 1:

- Headline: Pay Half Now. Pay the Other Half Later.
- Subheadline: Firs' Dibs BZ — Belize's smartest way to shop and save.
- Button: Shop Now
- Background image: slides 1
- Theme/intent: lifestyle image of a happy Belizean shopper with fashion and home products

Slide 2:

- Headline: Earn Points on Every Payment.
- Subheadline: Get 10 points per BZ$10 deposit + 5 points per BZ$10 balance payment. Redeem starting at just 300 points!
- Button: Explore Rewards
- Background image: slides 2
- Theme/intent: loyalty rewards teaser, points counter / gift box feel

Slide 3:

- Headline: Free Shipping Nationwide.
- Subheadline: Redeem with only 500 loyalty points — or pay standard rates from BZ$10–BZ$25.
- Button: View Shipping Info
- Background image: slides 3
- Theme/intent: Belize delivery / nationwide shipping

Slide 4:

- Headline: 👶 Welcome to Our Baby & Toddler Collection
- Subheadline: Everything you need for your little one — strollers, car seats, cribs, clothing, diapers, and nursery essentials.
- Button: Shop Baby Now
- Background image: slides 4
- Theme/intent: baby section welcome, soft pastel promotional feel

Slide 5:

- Headline: Invite a Friend. Earn 50 Points.
- Subheadline: When your friend completes their first deposit, you both win.
- Button: Refer Now
- Background image: slides 5
- Theme/intent: referral bonus, friendly and rewarding

Implementation requirements:

- Use a data-driven slides array instead of hardcoding repeated markup.
- Keep transitions smooth.
- Make buttons visually prominent and accessible.
- Add accessible labels where appropriate.
- If the current carousel logic already works, adapt it instead of replacing everything unnecessarily.
- If `src/public` is not the correct way to serve static images in Next.js, fix the paths properly and explain what should change.

Output format:

- Brief summary of what you changed
- Full updated `src/app/page.tsx` code
- Any additional notes or file/path fixes needed
