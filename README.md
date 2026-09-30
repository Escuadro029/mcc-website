# Microcircuits Corporation website

Plain HTML, CSS and JavaScript. No install, no build step.

## Run it in VS Code
1. Unzip, then File > Open Folder and pick `mcc-website`.
2. Install the "Live Server" extension (Ritwick Dey).
3. Right-click `index.html` > Open with Live Server.
(Videos and the map need an internet connection.)

## Folder
- `index.html` all content (from your website-copy slides and the live homepage)
- `css/styles.css` colors are the variables at the top (sampled from your live homepage)
- `js/main.js` animation, videos, map and the contact form
- `images/` put your logo here

## Videos (Vimeo)
The three cards look like your current site's players and play inline:
- The first card in view autoplays, muted (browsers do not allow autoplay with sound). "Tap for sound" turns sound on.
- Clicking any card plays it with sound and stops the others.
- Visitors who set "reduce motion" get no autoplay; they click to play.
Tondo: vimeo.com/1176108469, Cebu South: vimeo.com/1176112117, Amang Rodriguez: vimeo.com/1176120115.
They are unlisted, so each private key is built in (`data-h` in `index.html`).
If a video says it cannot be embedded, open it in Vimeo > Settings > Privacy and add your website's domain
under "Where can this be embedded".

## Contact section
Four quick cards (call, mobile, copy address, Google Maps directions), a form with floating labels, tick marks,
a progress bar, affiliation buttons and a message counter, a Google Map of the Mebson Center address, and an
animated "Message sent" screen.
**The form is not connected yet.** Until you replace `YOUR_FORM_ID` (index.html) with a free Formspree form ID
(https://formspree.io), it runs in demo mode: it shows the success screen with a yellow "Demo only" note and
sends nothing.

## Replace before going live
1. **Logo.** The header logo is a redraw from a screenshot. In `index.html`, replace the contents of
   `<a class="brand">` with `<img src="images/logo.png" alt="Microcircuits Corporation" height="56">`
2. **Form.** Connect Formspree as above.
3. **Icons (optional).** The six pillar icons are simple built-in ones; your Google Drive folder has your own SVGs.
4. **News photos.** Add event photos with captions in the News section.

## Animation (all plain CSS/JS, off for visitors who set "reduce motion")
Headline words rise in; section titles reveal word by word; header gradient drifts; floating color blobs and a
logo watermark move behind the hero; hero glow follows the pointer; scroll progress bar and a back-to-top button
with a progress ring; sections and cards fade up in sequence; pillar icons draw themselves; cards lift on hover;
video cards tilt in 3D and their play buttons pulse; the Our Story line draws itself; client names scroll in a
marquee; testimonials rotate; buttons have a magnetic pull, shine sweep and click ripple; contact cards shine on
hover; form fields tick when valid; a pin bounces while the map loads; the success check draws itself.

## Deploy
Upload the folder to Cloudflare Pages, Netlify (drag and drop at app.netlify.com/drop), or GitHub Pages,
then add your domain in the host's settings.
