import {
  html,
  css,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import { store, connect } from "../store.js";

class Component extends LitElement {
  static get properties() {
    return {
      single: { state: true },
    };
  }

  constructor() {
    super();

    this.disconnectStore = connect((state) => {
      if (this.single === state.single) return;
      this.single = state.single;
      // if (this.seasons === state.seasons) return;
      // this.seasons = state.seasons;
      // if (this.previews !== state.previews) {
      //   this.previews = state.previews;
      // }
    });
  }

  disconnectedCallback() {
    this.disconnectStore();
  }

  static styles = css`
    h1 {
      color: #00f9ef;
    }
    img {
      width: 110px;
      height: 100px;
    }
  `;

  render() {
    /**
     * @type {import('../types').show}
     */
    const show = this.single;
    if (!show) {
      return html`<div></div>`;
    }

    const backHandler = () => store.loadList();

    const seasons = show.seasons.map(({ episodes, title }) => {
      return html`
        <div>
          <strong>${title}</strong>
          ${episodes.map(({ file, title: innerTitle }) => {
            return html`
              <div>
                <div>${innerTitle}</div>
                <audio controls>
                  <source src="${file}" type="audio/mp3" />
                </audio>
                <button>Favorite ❤️</button>
              </div>
            `;
          })}
        </div>
      `;
    });

    return html`
      <button @click="${backHandler}" class="">👈 BACK</button>
      <h1>${show.title || ""}</h1>
      <img src="${show.image}" />
      ${seasons}
    `;
  }
}

customElements.define("podcast-view-single", Component);
