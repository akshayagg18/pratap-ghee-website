# Pratap Ghee - New Website

A complete redesign of www.pratapghee.com, art-directed from the 2026 product
catalogue: deep maroon canvases, gold double-rule frames with corner notches,
parchment pages, serif display type with gold italic accents.

## Stack

Pure static HTML + CSS + vanilla JS. No frameworks, no build step, no backend.
Upload the folder contents to any web host (including the current PHP hosting)
and it works.

## Pages

| File | Purpose |
|---|---|
| index.html | Home - hero (catalogue cover), heritage, products, why-choose, campaigns, clients, CTA |
| about.html | Our Heritage - founder story, timeline, trademark seal |
| pratap-desi-ghee.html | Desi Ghee - 8 sizes with catalogue pack shots |
| pratap-cow-ghee.html | Cow Ghee - 6 sizes |
| print.html | Brand campaigns + 9-ad print archive, with lightbox |
| radio.html | 6 radio jingles with custom players |
| dealer-locator.html | Instant client-side dealer search (62 dealers, 4 states - migrated from the old MySQL DB into js/dealers.js) |
| contact.html | Offices, phones, emails, socials + WhatsApp-powered contact form (no backend needed) |
| terms-conditions.html / privacy-policy.html / refund-policy.html | Policies |

## Notes

- **Contact form**: opens WhatsApp (+91-9810780490) with a pre-filled message.
  No mail server required. To change the number, search for `919810780490`.
- **Buy Now** buttons link to https://www.shop.pratapghee.com/.
- **Dealer data** lives in `js/dealers.js` - edit that file to add/remove dealers.
- **Client logos** live in `assets/clients/`; the list is at the bottom of
  index.html.
- Product pack shots were extracted from CATALOGUE.pdf as transparent PNGs
  (`assets/products/`).
- Fonts are loaded from Google Fonts (Playfair Display, Lora, Jost,
  Tiro Devanagari Hindi).
- Fully responsive (mobile drawer nav), keyboard accessible, honours
  `prefers-reduced-motion`.
