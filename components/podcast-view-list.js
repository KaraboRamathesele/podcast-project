import {
  html,
  css,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import { store, connect } from "../store.js";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

class Component extends LitElement {
  static get properties() {
    return {
      previews: { state: true },
      sorting: { state: true },
      search: { state: true },
      // image: { state: true },
      // key: { type: String },

      // label: { type: String },
      // seasons: { type: Number },
      // description: { type: String },
      // genres: { type: [String] },
      // lastUpdated: { type: String },
      // sortKey: { type: String },
    };
  }

  constructor() {
    super();

    this.disconnectStore = connect((state) => {
      if (this.previews !== state.previews) {
        this.previews = state.previews;
        // return;
      }
      if (this.sorting !== state.sorting) {
        this.sorting = state.sorting;
      }
      if (this.search !== state.search) {
        this.search = state.search;
      }
      // if (this.image !== state.image) {
      //   this.image = state.image;
      // }
    });
  }

  disconnectedCallback() {
    this.disconnectStore();
  }

  //styling
  static styles = css`
    :host {
      display: block;
      padding: 30px;
      background-color: #0c003d;
    }

    .hero-title {
      width: 100%;
      margin-bottom: 20px;
    }

    li {
      border: 1px solid var(--primary-blue);
      list-style-type: none;
    }

    .btn {
      appearance: none;
      background-color: #fafbfc;
      border: 1px solid rgba(27, 31, 35, 0.15);
      border-radius: 6px;
      box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0,
        rgba(255, 255, 255, 0.25) 0 1px 0 inset;
      box-sizing: border-box;
      color: #24292e;
      cursor: pointer;
      display: inline-block;
      font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial,
        sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      list-style: none;
      padding: 6px 16px;
      position: relative;
      transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      vertical-align: middle;
      white-space: nowrap;
      word-wrap: break-word;
    }

    .btn:hover {
      background-color: #f3f4f6;
      text-decoration: none;
      transition-duration: 0.1s;
    }

    .podcast-list {
      display: grid;
      gap: 30px;
    }
  `;

  render() {
    /**
     * @type {import('../types').preview[]}
     */
    const previews = this.previews;

    const filteredPreviews = previews.filter((item) => {
      if (!this.search) return true;
      return item.title.toLowerCase().includes(this.search.toLowerCase());
    });

    const sortedPreviews = filteredPreviews.sort((a, b) => {
      if (this.sorting === "a-z") return a.title.localeCompare(b.title);
      if (this.sorting === "z-a") return b.title.localeCompare(a.title);

      const dateA = new Date(a.updated).getTime();
      const dateB = new Date(b.updated).getTime();

      if (this.sorting === "oldest-latest") return dateA - dateB;
      if (this.sorting === "latest-oldest") return dateB - dateA;

      throw new Error("Invalid sorting");
    });

    const backHandler = () => store.loadList();

    const list = sortedPreviews.map(
      ({ title, id, updated, image, genres, seasons }) => {
        // image
        const date = new Date(updated);
        const day = date.getDate();
        const month = MONTHS[date.getMonth() - 1];
        const year = date.getFullYear();
        const theGenres = genres;

        const clickHandler = () => store.loadSingle(id);
        const clickHandler0 = () => store.loadSeasons(id);

        return html`
          <div
            class="podcast-list"
            style="margin-top: 5px;
          margin-left: 30%;
          margin-right: 30%;
          max-width: 40%;
          max-height: 40%;"
          >
            <h2>${title}</h2>
            <button>
              <h3 @click="${clickHandler}">Seasons: ${seasons}</h3>
            </button>
            <figure class="card-banner">
              <img
                src="${image}"
                width="400"
                height="400"
                @click="${clickHandler0}"
              />
            </figure>
            <div class="card-content">
              <div class="card-meta">Updated: ${day} ${month} ${year}</div>
            </div>
            <div class="card-content">
              <div class="card-meta">Genres: ${theGenres}</div>
            </div>
          </div>
        `;
      }
    );

    return html`
      <div class="hero-content">
        <img
          src="./images/hero-title.png"
          alt="Podcast"
          class="hero-title"
          style="width:50%;"
        />
      </div>
      <podcast-controls></podcast-controls>
      <hr />
      <div class="container">
        ${list.length > 0
          ? html`<ul>
              ${list}
            </ul>`
          : html`<div>No matches</div>`}
      </div>
    `;
  }
}

customElements.define("podcast-view-list", Component);
