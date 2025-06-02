import Hero from "../../components/Hero/Hero";
import TourCardGrid from "../../components/Card/TourCardGrid";
import { popularTours } from "../../data/tours";

const Home = () => {
  return (
    <main>
      <Hero />
      <div className="py-16">
        <TourCardGrid tours={popularTours} title="Explore Stays In Trending Destinations" subTitle="Find Hot Stays!" />
      </div>
    </main>
  );
};

export default Home;