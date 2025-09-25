import { getNotesMeta } from "~/lib/notes-data";
import { HomePageClient } from "./_components/home-page-client";

export default async function HomePage() {
  const notes = await getNotesMeta();

  return <HomePageClient notes={notes} />;
}
