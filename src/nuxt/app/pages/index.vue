<script setup>
 useSeoMeta({
  title: '15 Puzzle (By Jon Knoll)',
  description: 'A 15 puzzle game',
  image: '/phone.webp',
  url: 'https://15-puzzle.jonknoll.dev',
 });
</script>

<template>
 <div id="landing-page">
  <header>
   <div class="container">
    <h1>15 Puzzle <span>(By Jon Knoll)</span></h1>
    <a href="/play" class="button" style="--background: #6e81b7"> Play </a>
   </div>
  </header>
  <main>
   <div class="container">
    <div class="right mobile">
     <img src="/iphone.webp" alt="iPhone cut out, so that video game play fits inside the phone" />

     <video autoplay loop muted playsinline>
      <source src="/15_gameplay.mp4" type="video/mp4" />
     </video>
    </div>
    <div class="left">
     <h2>The Classic Sliding Puzzle</h2>
     <p>
      Love brain teasers? The timeless 15-Puzzle game is here, designed to challenge your mind with a simple yet
      engaging experience.
     </p>

     <!-- <div class="cta mobile">
            <h3>Download Now & Start Sliding!</h3>
            <p>
              No sign-ups, no gimmicks—just pure puzzle fun.
            </p>
            <p>
              Get it today and give your brain a workout!
            </p>
            <ul class="download">
              <li>
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  title="Download on the App Store"
                >
                  <img src="/app_store.webp" alt="Download on the App Store" />
                </a>
              </li>
              <li>
                <a
                  href="https://play.google.com/store/games?hl=en_US"
                  target="_blank"
                  title="Download on the Google Play Store"
                >
                  <img
                    src="/play_store.webp"
                    alt="Download on the Google Play Store"
                  />
                </a>
              </li>
            </ul>
          </div> -->

     <h3>Why You'll Love It:</h3>
     <ul class="features">
      <li>Simple & Intuitive – Just slide the tiles into order. No fluff, no distractions.</li>
      <li>Completely Free – No hidden costs, no in-app purchases.</li>
      <li>Ad-Free – Play uninterrupted, no annoying ads.</li>
      <li>Lightweight & Fast – Minimalist design for a smooth gaming experience.</li>
     </ul>
     <div class="cta">
      <h3>Download Now & Start Sliding!</h3>
      <p>No sign-ups, no gimmicks—just pure puzzle fun. Get it today and give your brain a workout!</p>
      <ul class="download">
       <li>
        <a
         href="https://apps.apple.com/us/app/15-puzzle-by-jon-knoll/id6742034631"
         target="_blank"
         title="Download on the App Store"
        >
         <img src="/app_store.webp" alt="Download on the App Store" />
        </a>
       </li>
       <li>
        <a
         href="https://play.google.com/store/apps/details?id=tubstrr.jonknoll.fifteenpuzzle"
         target="_blank"
         title="Download on the Google Play Store"
        >
         <img src="/play_store.webp" alt="Download on the Google Play Store" />
        </a>
       </li>
      </ul>
     </div>
    </div>
    <div class="right desktop">
     <img src="/iphone.webp" alt="iPhone cut out, so that video game play fits inside the phone" />

     <video autoplay loop muted playsinline>
      <source src="/15_gameplay.mp4" type="video/mp4" />
     </video>
    </div>
   </div>
  </main>
 </div>
</template>

<style>
 #landing-page {
  background-color: #0f3433;
  min-height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  background: rgb(110, 183, 132);
  background: radial-gradient(circle, rgba(110, 183, 132, 0.25) 0%, rgba(7, 62, 60, 1) 81%, rgba(15, 52, 51, 1) 100%);

  background: rgb(15, 52, 51);
  background: linear-gradient(
   180deg,
   rgba(15, 52, 51, 1) 0%,
   /* rgba(110, 183, 132, 0.25) 20%,
    rgba(7, 62, 60, 1) 40%, */ rgba(110, 183, 132, 0.125) 100%
  );
 }
 #landing-page > main {
  flex: 1;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
 }
 header {
  /* background-color: #6eb784; */
  color: white;
  padding: 1rem 0;
 }

 header > .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto;
 }

 h1 {
  font-weight: 900;
  font-size: 2rem;
 }
 h2 {
  font-weight: 900;
  font-size: 1.85rem;
  margin-bottom: 0.2em;
  line-height: 1.3;
 }
 h3 {
  font-weight: 700;
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 0.2em;
  line-height: 1.4;
 }
 h4 {
  font-weight: 700;
  font-size: 1.25rem;
 }

 p {
  font-size: 1.1rem;
  line-height: 1.4;
  letter-spacing: 0.1px;
 }

 .features {
  list-style: none;
  padding: 0;
  margin-bottom: 2em;
 }

 .features > li {
  margin-bottom: 0.5em;
 }

 .features > li::before {
  content: '✅ ';
  margin-right: 0.25em;
 }

 .container {
  width: min(90%, 1200px);
 }

 .button {
  background-color: var(--background);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-weight: bold;
  text-transform: uppercase;
  border: 1px solid var(--background);
  transition: 300ms ease;
  letter-spacing: 0.05em;
 }

 .button:hover {
  background-color: white;
  color: var(--background);
  letter-spacing: 0.1em;
 }

 main > .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
 }

 main > .container > .left {
  width: min(100%, 65ch);
 }

 main > .container > .left .cta {
  /* background: rgb(110, 183, 132); */
  background: hsl(0, 0%, 20%);
  /* color: black; */
  padding: 1.2rem;
  border-radius: 0.3em;
  margin: 2rem 0;
 }
 main > .container > .left .cta.desktop {
  margin-bottom: 0;
 }

 main > .container > .left .cta h3 {
  margin: 0;
 }

 main > .container > .left .cta ul.download {
  display: flex;
  justify-content: flex-start;
  list-style: none;
  padding: 0;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
 }

 main > .container > .left .cta ul > li > a {
  display: block;
  width: 20ch;
  transition: 200ms;
 }
 main > .container > .left .cta ul > li > a img {
  width: 100%;
 }
 main > .container > .left .cta ul > li > a:hover {
  opacity: 0.8;
  transform: scale(1.05);
 }

 main > .container .right {
  width: min(100%, 35ch);
  position: relative;
  aspect-ratio: 9 / 16;
 }

 main > .container .right > img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 1;
 }

 main > .container .right > video {
  position: absolute;
  top: 0;
  left: 10%;
  width: 80%;
  object-fit: contain;
  z-index: 0;
  border-radius: 40px;
 }

 .mobile {
  display: none;
 }

 @media (max-width: 768px) {
  .mobile {
   display: block;
  }
  .desktop {
   display: none;
  }

  header > .container {
   flex-direction: column;
   align-items: flex-start;
   position: relative;
   margin: auto;
  }

  .container {
   padding: 0;
  }

  header > .container h1 {
   line-height: 1;
  }
  header > .container h1 span {
   font-size: 1rem;
   display: inline-block;
   width: 100%;
  }

  header > .container .button {
   position: absolute;
   top: 50%;
   right: 0;
   transform: translateY(-50%);
  }

  main > .container > .left .cta {
   margin: 4rem 0;
  }

  main {
   padding: 4rem 0;
  }

  main > .container .right {
   margin-bottom: 4rem;
  }
 }
</style>
