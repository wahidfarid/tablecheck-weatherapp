# TableCheck interview task : Weather-app

## Description

[Weather application made with React](https://table-check-weather-app.vercel.app/). It works either by asking for your geolocation, or by a list of comma-seperated cities in the query parameters like this example https://table-check-weather-app.vercel.app/?city=tokyo,cairo,london,dubai

## Comments

- normalize.css is used for it's superior browser support (which is needed because we are targeting IE 11). The catch is it's a bit old and janky. i had to write some code in `global-styles.css` regarding `html` and `body` that i probably wouldn't have needed if i used a better CSS reset

- I've lost quite a bit of time to setting up Razzle (apparently it doesn't support the latest v15. i could only get it working properly with LTS v14), and getting used to XState (especially unit testing it). i'm familliar with redux however i was intrigued about XState since it was mentioned in the interview and decided to try it for this task.

- XState's react hooks don't want to play nicely with enzyme, it seems I have to jump through a bunch of loops to get it to work without raising any errors

- The bulk of my previous experience was with [Tyro-app](https://tyro-app.com) which had videoconferencing done over websockets and WebRTC. That means that it was a requirement for our users to have recent versions of their browsers, or in some cases completely avoid certain browsers such as IE/Edge as they did not support WebRTC. That means i didn't have a lot of experience with transpiling and polyfilling JS. It took me quite a bit of time and effort to get it working here, especially because i've stopped using Windows and wasn't going to dual-boot or run a VM just to confirm IE11 is working properly. So my development iteration was slow due to needing to use free tiers of online crossbrowser testing services

- I'm very familliar with styled-components. with this project though i decided to try out emotion/css (the project has very little UI elements and would be ideal to test something new). I have to say it does work well and but i think i prefer styled-components more. styled-components is slightly more restrictive in writing, and that is something i actually prefer. it also makes the actual component layout look much cleaner than emotion/css. on the other hand, emotion/css is easier to interpolate dynamically and is platform-agnostic. perhaps it would be ideal to use emotion/css in very small projects then, except i'd probably opt to just use plain SASS/SCSS instead. You could still simply use styled through emotion, but i need to look into if the extra dependencies are worth it.

---

### Wireframe before implementation
![Wireframe](wireframe.png)
### Checklist

- [x] Set up repo with razzle
- [x] convert project to use typescript
- [x] Install xState
- [x] Install Jest/Enzyme
- [x] Clear razzle dummy html/css
- [x] get font and icons and emotion
- [x] wireframe design
- [x] get user geolocation
- [x] install axios
- [x] query weather api for data
- [x] display data, map data to icons
- [x] refresh every 5 minutes
- [x] get data from url querystring (comma seperated)
- [x] Deploy
- [x] fade animations between refreshes
- [x] Fix IE11 (tested working properly on chrome/firefox/safari/edge)
- [x] Different layout for desktop view (as per wireframe)

### Future nice to haves
- [x] animated background icons
- [x] Storybook components
- [ ] Refactor existing unit tests and implement more
- [ ] Only import needed icons from weather-icons
- [ ] render city weather through SSR without forcing user through initial state
- [ ] Refactor WeatherMachine into smaller actors
- [ ] Page insights testing
- [ ] Dynamic youtube Video backgrounds based on weather
- [ ] E2E testing
- [ ] Visualize machine states

### Pending issues
- Scrolling icon background's speed and direction get stuck after completing a full cycle of all listed cities
- Importing the global styles in Storybook's `preview.js` or `preview-head.html` does not display the component properly for some reason? for the time being, importing the global styles inside each component story seems to properly display everything
...