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
      // this.season = state.season;
      // if (this.previews !== state.previews) {
      //   this.previews = state.previews;
      //   return;
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
      display: flex;
      justify-content: center;
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

    const seasons = show.seasons.map(({ episodes, title, audio }) => {
      return html`
        <div>
          <strong>${title}</strong>
          ${episodes.map(({ id, file, title: innerTitle }) => {
            return html`
              <div>
                <div>${innerTitle}</div>
                <audio controls>
                  <source src="${file}" type="${audio}/mp3" />
                </audio>
              </div>
            `;
          })}
        </div>
      `;
    });

    // const previews = this.previews;

    // const filteredPreviews = previews.filter((item) => {
    //   if (!this.search) return true;
    //   return item.title.toLowerCase().includes(this.search.toLowerCase());
    // });

    // const sortedPreviews = filteredPreviews.sort((a, b) => {
    //   if (this.sorting === "a-z") return a.title.localeCompare(b.title);
    //   if (this.sorting === "z-a") return b.title.localeCompare(a.title);

    //   const dateA = new Date(a.updated).getTime();
    //   const dateB = new Date(b.updated).getTime();

    //   if (this.sorting === "oldest-latest") return dateA - dateB;
    //   if (this.sorting === "latest-oldest") return dateB - dateA;

    //   throw new Error("Invalid sorting");
    // });

    return html`
      <button @click="${backHandler}" class="">👈 BACK</button>

      <h1>${show.title || ""}</h1>
      <img src="${show.image}" />
      ${seasons}
    `;
  }
}

customElements.define("podcast-view-single", Component);
