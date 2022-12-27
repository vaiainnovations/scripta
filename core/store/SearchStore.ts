import { defineStore } from "pinia";
import { useBackendStore } from "./BackendStore";
import { useUserStore } from "./UserStore";
import { registerModuleHMR } from ".";
import { PostExtended, searchFirstContentImage } from "~~/types/PostExtended";
import { AuthorSearch } from "~~/types/SearchResults";

export const useSearchStore = defineStore({
  id: "SearchStore",
  state: () => ({
    articleResults: [] as PostExtended[],
    userResults: [] as AuthorSearch[]
  }),
  actions: {
    async search (query: string): Promise<void> {
      this.articleResults = await searchArticles(query);

      // fetch articles users
      this.articleResults.forEach(async (article) => {
        await useUserStore().getUser(article.author, true);
      });

      this.userResults = await searchAuthors(query);
    },
    async searchByTags (query: string): Promise<PostExtended[]> {
      const articles = await searchArticles(query, true);
      // retrieve article first image
      for (let i = 0; i < articles.length; i++) {
        articles[i].author = await useUserStore().getUser(articles[i].author, true);
        articles[i].image = searchFirstContentImage(articles[i].content) || "/img/author_pic.png";
      }
      return articles;
    }
  }
});

/**
 * Search articles on the backend
 * @param query query string of the search
 * @param isByTag if want a search by tag
 * @returns found posts
 */
async function searchArticles (query: string, isByTag = false): Promise<PostExtended[]> {
  try {
    const resArticles = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}search/posts/`, "POST", {
      "Content-Type": "application/json"
    }, JSON.stringify({ q: query, onlyTags: isByTag }))).json() as PostExtended[] || [];
    return resArticles;
  } catch (e) { }
  return [];
}

/**
 * Search articles on the backend
 * @param query query string of the search
 * @returns found posts
 */
async function searchAuthors (query: string): Promise<AuthorSearch[]> {
  try {
    const resAuthors = (await (await useBackendStore().fetch(`${useBackendStore().apiUrl}search/user/`, "POST", {
      "Content-Type": "application/json"
    }, JSON.stringify({ q: query }))).json() as AuthorSearch[]);
    return resAuthors;
  } catch (e) { }
  return [];
}

// Register the store to enable HMR
registerModuleHMR(useSearchStore);
