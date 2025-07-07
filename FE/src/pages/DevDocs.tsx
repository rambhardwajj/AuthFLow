import Navbar from "@/components/Navbar";

const DevDocs = () => {
  return (
    <div className="bg-zinc-900 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center gap-12 px-4 py-10 md:px-10 lg:px-20">
        <h1 className="text-white text-4xl  ">
          {" "}
          User Session Management Flow{" "}
        </h1>

        <img
          src="image-1.png"
          alt="Dev documentation screenshot 1"
          className="w-full max-w-5xl rounded-2xl border border-zinc-600 shadow-lg p-6 transition hover:scale-105 hover:shadow-red-700"
        />
        
        <h1 className="text-white text-4xl  ">
          {" "}
          Auth Flow with Cookes and Session {" "}
        </h1>

        <img
          src="image.png"
          alt="Dev documentation screenshot 2"
          className="w-full max-w-5xl rounded-2xl border border-zinc-500 shadow-lg p-6 transition hover:scale-105 hover:shadow-red-700"
        />
        <div className="text-white border-b border-white  min-w-[100vh] "> </div>
        <h1 className="text-white text-4xl  "> Google Login Flow </h1>

        <img
          src="googleLogin.png"
          alt="Google login screenshot"
          className="w-full max-w-5xl rounded-2xl border border-red-500 shadow-lg p-6 transition hover:scale-105 hover:shadow-red-700"
        />
        
      </div>
    </div>
  );
};

export default DevDocs;
