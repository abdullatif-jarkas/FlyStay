import { TourCardGridProps } from "../../types/components/Card/TourCard";
import SectionTitle from "../ui/SectionTitle";
import TourCard from "./TourCard";



const TourCardGrid = ({ tours, title, subTitle }: TourCardGridProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {title && <SectionTitle title={title} subTitle={subTitle} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tours.map((tour) => (
          <TourCard
            key={tour.id}
            id={tour.id}
            image={tour.image}
            title={tour.title}
            location={tour.location}
            dateRange={tour.dateRange}
            description={tour.description}
            rating={tour.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default TourCardGrid;
