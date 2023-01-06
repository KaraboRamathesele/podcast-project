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
      width: 70px;
      height: 70px;
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
      const seasonNumber = count(show.seasons);

      return html`
        <div>
          <strong>${title}</strong>
          ${episodes.map(({ file, title: innerTitle }) => {
            return html`
              <div>
                <div>${innerTitle}</div>
                <audio controls>
                  <source
                    src="https://file-examples.com/storage/fe8c7eef0c6364f6c9504cc/2017/11/file_example_MP3_700KB.mp3"
                    type="audio/mp3"
                  />
                </audio>
              </div>
            `;
          })}
        </div>
      `;
    });

    return html`
      <button @click="${backHandler}">&#8592; BACK</button>
      <div class="float">
        <img src="${show.image}" />
        <p>${show.description}</p>
      </div>
      <hr />
      ${seasons}
    `;
  }
}

customElements.define("podcast-view-single", Component);

// return html`
// <div>
//   <strong>${title}</strong>
//   ${episodes.map(({ audio, title: innerTitle }) => {
//     return html`
//       <div>
//         <div>${innerTitle}</div>
//         <audio controls>
//           <source src="${audio}" type="audio/mp3" />
//         </audio>
//         <button>Favorite ❤️</button>
//       </div>
//     `;
//   })}
// </div>
// `;
