import type { Page } from "./types/page.ts";

export class Router {
  private pages = new Map<string, Page>();
  private activePage: string | null = null;

  register(page: Page) {
    this.pages.set(page.id, page);
    page.renderable.visible = false;
  }

  navigate(pageId: string) {
    const nextPage = this.pages.get(pageId);
    if (!nextPage) return;

    if (this.activePage) {
      const currentPage = this.pages.get(this.activePage);
      if (currentPage) {
        currentPage.onLeave?.();
        currentPage.renderable.visible = false;
      }
    }

    nextPage.renderable.visible = true;
    nextPage.onEnter?.();

    this.activePage = pageId;
  }

  getActivePage(): Page | undefined {
    if (!this.activePage) return undefined;
    return this.pages.get(this.activePage);
  }
}
