import { getData } from "./components/api.js";
import "./components/podcast-app.js";
import "./components/podcast-view-list.js";
import "./components/podcast-view-single.js";
import "./components/podcast-controls.js";
import "./components/podcast-seasons.js";

let showAPI = "https://podcast-api.netlify.app/shows";
let showData = await getData(showAPI);
