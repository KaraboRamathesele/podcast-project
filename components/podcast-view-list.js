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
    });
  }

  disconnectedCallback() {
    this.disconnectStore();
  }

  //styling
  static styles = css`
    :host {
      padding: 30px;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      background-color: #0c003d;
    }

    :root {
      --transition: 0.25s ease-in-out;

      --fs-1: 25px;
      --fs-2: 18px;
      --fs-3: 17px;
      --fs-4: 15px;
    }

    .hero-title {
      width: 100%;
      margin-top: 20px;
      padding-left: 40px;
    }

    li {
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

    .podcast {
      padding: 20px 0;
    }

    //grid

    .podcast-list {
      display: grid;
      gap: 30px;
    }

    @media (min-width: 1200px) {
      .podcast-list {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .podcast-list {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 768px) {
      .podcast-list {
        grid-template-columns: 1fr 1fr;
      }
    }

    //placement
    .podcast-card {
      border-radius: 4px;
    }

    .card-banner {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
      z-index: 1;
    }

    .card-banner::before {
      content: "";
      position: absolute;
      inset: 0;
    }

    .podcast-card:is(:hover, :focus) .card-banner::before {
      background: hsla(0, 0%, 100%, 0.1);
    }

    .card-banner img {
      width: 260px;
    }

    .podcast-card:is(:hover, :focus) .card-banner-icon {
      background: white;
      color: #0052ff;
    }

    .card-meta {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      color: #aba6bd;
      font-size: var(--fs-4);
      margin-left: 35px;
      margin-bottom: 15px;
    }

    .card-meta::before {
      content: "";
      position: absolute;
      top: 50%;
      left: -35px;
      transform: translateY(-2px);
      width: 25px;
      height: 2px;
      background: #aba6bd;
    }

    .podcast-card .card-title {
      display: inline;
      padding: 3px 0;
      background: var(--gradient);
      background-position: 0 95%;
      background-repeat: no-repeat;
      background-size: 0 2px;
      transition: var(--transition);
    }

    .podcast-card:is(:hover, :focus) .card-title {
      background-size: 20% 2px;
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

    const list = sortedPreviews.map(
      ({ title, id, updated, image, genres, seasons }) => {
        // image
        const date = new Date(updated);
        const day = date.getDate();
        const month = MONTHS[date.getMonth() - 1];
        const year = date.getFullYear();
        const theGenres = genres;

        const clickHandler = () => store.loadSingle(id);
        //const clickHandler0 = () => store.loadSeasons(id);

        return html`
          <section class="podcast">
            <ul>
              <li class="podcast-list">
                <div @click="${clickHandler}">
                  <figure class="card-banner ">
                    <img src="${image}" alt="" class="podcast-card" />
                  </figure>

                  <div class="card-content">
                    <div class="card-meta">
                      Updated: ${day} ${month} ${year}
                    </div>
                    <p class="pod-epi">Genres: ${theGenres}</p>

                    <h3 class="h3 card-title">${title}</h3>
                    <h3 @click="${clickHandler}">Seasons: ${seasons}</h3>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        `;
      }
    );

    return html`
      <div class="hero-content">
        <img
          src="./images/hero-title.png"
          alt="Podcast"
          class="hero-title"
          style="width:40%; "
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
