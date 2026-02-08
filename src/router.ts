import type { Page } from "./pages/home";

export class Router {
  private pages = new Map<string, Page>();
  private activePage: string | null = null;

  register(page: Page) {
    this.pages.set(page.id, page);
    page.renderable.visible = false;
  }
  navigate(pageId: string) {
    // 1. Call onLeave on current page
    // 2. Set current page display to "none"
    // 3. Set new page display to "flex"
    // 4. Call onEnter on new page
    // 5. Update activePage

    // get the new page from map
    const nextPage = this.pages.get(pageId);
    if (!nextPage) return;

    // if there's a current page then hide it
    if (this.activePage) {
      const currentPage = this.pages.get(this.activePage);
      if (currentPage) {
        currentPage.onLeave?.(); // tell the page its leaving
        currentPage.renderable.visible = false; // hide the page
      }
    }

    // show the new page
    nextPage.renderable.visible = true; // make new page visible
    nextPage.onEnter?.(); // tell the page its entering

    // update which page is active
    this.activePage = pageId;
  }
  getActive(): Page | undefined {
    if (!this.activePage) return undefined;
    return this.pages.get(this.activePage);
  }
}
