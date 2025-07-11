import Hero from "../../components/Hero/Hero";
import TourCardGrid from "../../components/Card/TourCardGrid";
import { popularTours, searchByCategory } from "../../data/tours";
import GetInspiration from "../../components/GetInspiration/GetInspiration";

const Home = () => {
  return (
    <main>
      <Hero />
      <div className="py-16">
        <TourCardGrid tours={popularTours} title="Explore Stays In Trending Destinations" subTitle="Find Hot Stays!" />
        <TourCardGrid tours={searchByCategory} title="Compare The Highest Reviewed Past Offers " subTitle="Browse By Type" />
      </div>
      <GetInspiration />
    </main>
  );
};

export default Home;