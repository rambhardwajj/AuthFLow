import Navbar from "@/components/Navbar";

const DevDocs = () => {
  return (
    <div className="bg-zinc-900 flex flex-col ">
      <Navbar />
      <div className=" flex flex-col justify-center items-center m-10 ">
        <img
          src="image-1.png"
          alt=""
          className="p-10 mx-auto border rounded-md border-red-500 "
        />
        <img
          src="image.png"
          alt=""
          className="p-10 my-10 border rounded-md border-red-500"
        />
      </div>
    </div>
  );
};

export default DevDocs;
