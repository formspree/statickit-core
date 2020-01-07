const now = (): number => {
  // @ts-ignore
  return 1 * new Date();
};

const webdriver = (): boolean => {
  return (
    navigator.webdriver ||
    !!document.documentElement.getAttribute('webdriver') ||
    // @ts-ignore
    !!window.callPhantom ||
    // @ts-ignore
    !!window._phantom
  );
};

export class Session {
  mousemove: number;
  keydown: number;
  loadedAt: number;
  webdriver: boolean;
  private onMouseMove: () => void;
  private onKeyDown: () => void;

  constructor() {
    this.mousemove = 0;
    this.keydown = 0;
    this.loadedAt = now();
    this.webdriver = webdriver();

    this.onMouseMove = () => {
      this.mousemove += 1;
    };

    this.onKeyDown = () => {
      this.keydown += 1;
    };

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('keydown', this.onKeyDown);
  }

  teardown(): void {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  data(): {
    mousemove: number;
    keydown: number;
    loadedAt: number;
    webdriver: boolean;
  } {
    return {
      mousemove: this.mousemove,
      keydown: this.keydown,
      loadedAt: this.loadedAt,
      webdriver: this.webdriver
    };
  }
}
