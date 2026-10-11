import Hero from "../components/Hero";
import Collection from "../components/Collection";

export default function Home({ introComplete }) {
  return (
    <>
      <Hero introComplete={introComplete} />
      <Collection />
    </>
  );
}