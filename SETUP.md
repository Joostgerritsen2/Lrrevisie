# LR Revisie — Setup Instructies

## Sanity Project aanmaken

1. Ga naar https://sanity.io en maak een nieuw project aan
2. Kopieer je `projectId` en vul in `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=jouw-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=jouw-api-token
   ```
3. Start Sanity Studio: ga naar `/studio` op je lokale dev server
4. Voeg producten en categorieën toe

## Vercel Deploy

1. Push code naar GitHub
2. Importeer repo in Vercel (vercel.com/new)
3. Voeg environment variables toe (zie .env.local)
4. Deploy!

## Video Hero

Lever een `.mp4` video aan en plaats in `public/video/hero.mp4`
Aanbevolen: 1920×1080, max 10MB, Land Rover werkplaats footage

## Logo

Het huidige logo (`LR_Logo.jpg`) heeft een witte achtergrond.
Voor een transparante versie: vraag de eigenaar om een PNG met transparante achtergrond.
