import "./components/podcast-app.js";
import "./components/podcast-episode.js";
import "./components/podcast-view-list.js";
import "./components/podcast-view-single.js";
import "./components/podcast-controls.js";

let showAPI = "https://podcast-api.netlify.app/shows";
let showData = await getData(showAPI);
