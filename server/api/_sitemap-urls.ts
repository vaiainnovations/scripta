interface SitemapRecord {
  loc: string;
  lastmod: number;
}

export default cachedEventHandler(async () => {
  // GraphQL query to get all the articles published
  const query = `query sitemapArticles {
    post_aggregate(where: {subspace_id: {_eq: ${useRuntimeConfig().public.subspaceId}}, _and: {conversation_row_id: {_is_null: true}}}, order_by:{creation_date: desc}) {
      nodes {
       id: external_id
       author: post_author {
         dtag
       }
       created: creation_date
       edited: last_edited_date
     }
   }
 }`;
  const articlesRaw = await $fetch(`${useRuntimeConfig().public.restApiUrl}/graphql`, {
    "Content-Type": "application/json",
    method: "POST",
    body: JSON.stringify({
      q: query,
      type: "desmos"
    })
  }) as any;

  const sitemapArticles: SitemapRecord[] = [];
  const sitemapAuthors: SitemapRecord[] = [];

  const articles = articlesRaw.data.post_aggregate.nodes;
  articles.forEach((a: { author: { dtag: string; }; id: string; created: any; edited: any }) => {
    // push the article route
    sitemapArticles.push({
      loc: `/@${a.author.dtag}/${a.id}`,
      lastmod: a.edited || a.created
    });
    // push the author route, no need to check if the author is already present
    sitemapAuthors.push({
      loc: `/@${a.author.dtag}`,
      lastmod: a.edited || a.created
    });
  });
  return [...sitemapArticles, ...sitemapAuthors];
}, {
  name: "articles-sitemap.xml",
  maxAge: 60 * 10 // cache URLs for 10 minutes,
});
