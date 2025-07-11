import { RiArrowGoBackLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <section
      className="w-full h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/imgs/error/404.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center -800px",
      }}
    >
      {/* Overlay Layer */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="text-center p-8 rounded-xl relative z-10">
        <h1 className="font-bold text-[100px] leading-[140%] tracking-[0px] text-[#D9D9D9]/50">
          404
        </h1>
        <p className="text-2xl opacity-70 mt-[30px] mb-[49px] font-bold leading-[140%] tracking-[0px] text-white">
          The Page Was Not Found, Sorry!
        </p>
        <Link
          to="/"
          className="flex items-center justify-center w-fit mx-auto gap-4 bg-primary-500 hover:bg-primary-400 leading-[140%] tracking-[0px] text-white px-6 py-3 rounded-md transition"
        >
          <span>
            <RiArrowGoBackLine />
          </span>
          <span>Return To Home Page</span>
        </Link>
      </div>
    </section>
  );
};

export default Error;
