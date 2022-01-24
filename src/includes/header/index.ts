import "./header.scss";

class Header {
  root: HTMLElement | null;

  constructor() {
    this.root = document.querySelector("header");
  }
}

export default Header;
