//sorting controls

import {
  html,
  LitElement,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import { store, connect } from "../store.js";

class Component extends LitElement {
  static get properties() {
    return {
      sorting: {},
      search: {},
    };
  }

  constructor() {
    super();

    this.disconnectStore = connect((state) => {
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

  static styles = css`
    :host {
      display: flex;
      justify-content: space-around;
      padding: 1rem 0.5rem 2rem;
      gap: 0.5rem;
    }

    input {
      width: 15rem;
      padding: 0.75rem;
      border-radius: 0.25rem;
      border: 1px solid #fff;
      outline: none;
      font-size: 1.05rem;
    }

    .search {
      color: #fff;
      font-size: 1.05rem;
    }

    select {
      width: 15rem;
      padding: 0.75rem;
      border-radius: 0.25rem;
      border: 1px solid #fff;
      outline: none;
      font-size: 1.05rem;
    }
  `;

  render() {
    const changeHandler = (event) => {
      store.changeSorting(event.target.value);
    };

    const inputHandler = (event) => {
      store.changeSearch(event.target.value);
    };

    return html`
      <div>
        <label>
          <span class="search">Search</span>
          <input @input="${inputHandler}" value="${this.search}" />
        </label>

        <label>
          <span style="font-weight:bold;">Sorting</span>
          <select @change="${changeHandler}">
            <option value="a-z" .selected="${this.sorting === "a-z"}">
              A - Z
            </option>
            <option value="z-a" .selected="${this.sorting === "z-a"}">
              Z - A
            </option>
            <option
              value="oldest-latest"
              .selected="${this.sorting === "oldest-latest"}"
            >
              Oldest - Latest
            </option>
            <option
              value="latest-oldest"
              .selected="${this.sorting === "latest-oldest"}"
            >
              Latest - Oldest
            </option>
          </select>
        </label>
      </div>
    `;
  }
}

customElements.define("podcast-controls", Component);
