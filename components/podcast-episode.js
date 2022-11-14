import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import {
  addPodcastEpisode,
  removePodcastEpisode,
  loadData,
} from "../watchlist.js";

class Episode extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      description: { type: String },
      episode: { type: Number },
      file: { type: String },
      isFavourite: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.isFavourite = false;
  }

  static styles = css`
    :host {
      box-sizing: border-box;
    }
  `;

  playPodcastEpisode() {
    const source = document.getElementById("audio-source");
    const player = document.getElementById("audio-player");
    source.src = this.file;
    player.load();
  }

  savePodcastEpisode() {
    addPodcastEpisode({
      title: this.label,
      episode: this.episode,
      file: this.file,
      description: this.description,
    });
    this.isFavourite = true;
  }

  removePodcastEpisode() {
    removePodcastEpisode({
      title: this.label,
      episode: this.episode,
      file: this.file,
      description: this.description,
    });
    this.isFavourite = false;
  }

  render() {
    const data = loadData();
    if (
      data.find(
        (episode) =>
          episode.savedPodcastEpisode.title === this.label &&
          episode.savedPodcastEpisode.episode === this.episode
      )
    ) {
      this.isFavourite = true;
    }

    return html`
      <div class="">
        <p>
          <button id="play" @click="${this.playPodcastEpisode}">Play</button>
          <button
            id="play-podcast"
            @click="${this.isFavourite
              ? this.removePodcastEpisode
              : this.savePodcastEpisode}"
          >
            ${this.isFavourite ? "Remove Favourite" : "Add Favourite"}
          </button>
          ${this.label}
        </p>

        <p>${this.description}</p>
      </div>
    `;
  }
}

customElements.define("podcast-episode", Episode);
