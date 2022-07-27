import { GetServerSideProps } from "next";
import axios from "axios";

const DGRAPH_URL = "https://dgraph.toccatech.com/graphql";

const QUERY_COMPOSERS = `
  query {
    queryComposer(filter: { isDeleted: false }) {
      id
      name
    }
  }
`;

interface Composer {
  id: string;
  name: string;
}

function generateSiteMap(composers: Composer[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://toccatech.com</loc>
     </url>
     <url>
       <loc>https://toccatech.com/encyclopaedia</loc>
     </url>
     <url>
       <loc>https://toccatech.com/encyclopaedia/new-composer</loc>
     </url>
     <url>
       <loc>https://toccatech.com/score-library</loc>
     </url>
     ${composers
       .map(({ id }) => {
         return `
       <url>
           <loc>${`https://toccatech.com/encyclopaedia/${id}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const { data } = await axios.post(DGRAPH_URL, { query: QUERY_COMPOSERS });
  const composers = data.data.queryComposer;

  const sitemap = generateSiteMap(composers);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
