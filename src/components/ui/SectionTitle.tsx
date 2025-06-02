import { SectionTitleProps } from "../../types/components/ui/SectionTitle";

const SectionTitle = ({ title, subTitle }: SectionTitleProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-[32px] font-bold mb-3">{title}</h2>
      <h4 className="font-semibold">{subTitle}</h4>
    </div>
  );
};

export default SectionTitle;
