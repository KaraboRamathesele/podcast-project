import {
  html,
  css,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import { store, connect } from "../store.js";

class Component extends LitElement {
  static get properties() {
    return {
      seasons: { state: true },
    };
  }

  constructor() {
    super();

    this.disconnectStore = connect((state) => {
      if (this.seasons === state.seasons) return;
      this.seasons = state.seasons;
    });
  }

  disconnectedCallback() {
    this.disconnectStore();
  }

  render() {
    /**
     * @type {import('../types').show}
     */
    const show = this.seasons;
    if (!show) {
      return html`<div></div>`;
    }

    const backHandler = () => store.loadList();

    const season = show.seasons.map(({ id, title, episodes, image }) => {
      // const clickHandler = () => store.loadSingle(id);
      const clickHandler = () => store.loadSeasons(id);

      return html`
        <div>
          <strong>${title}</strong>
          <img
            src="${image}"
            width="300px"
            height="300px"
            @click="${clickHandler}"
          />
        </div>
        <div>
          ${episodes.map(({ audio, title: innerTitle }) => {
            return html`
              <div>
                <div style="margin-top: 12px;">${innerTitle}</div>
                <br />
                <audio controls>
                  <source src="${audio}" type="audio/mp3" />
                </audio>
                <a>Favorite ❤️</a>
              </div>
            `;
          })}
        </div>
      `;
    });

    return html`
      <button @click=${backHandler}>👈 BACK</button>
      <h1>${show.title || ""}</h1>
      <p>${show.description}</p>
      <hr />
      <div>${season}</div>
    `;
  }
}
customElements.define("podcast-seasons", Component);
