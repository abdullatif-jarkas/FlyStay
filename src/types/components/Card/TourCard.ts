export interface Tour {
  id: string;
  image: string;
  title: string;
  location: string;
  dateRange: string;
  description: string;
  rating?: number;
}

export interface TourCardGridProps {
  tours: Tour[];
  title?: string;
  subTitle?: string;
}