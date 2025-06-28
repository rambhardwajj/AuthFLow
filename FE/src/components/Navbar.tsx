import { useLogoutMutation } from "@/redux/services/apiSlice";
import { Button } from "./ui/button";
import { useUser } from "@/hooks";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const { data: user,  } = useUser();

  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const response = await logout().unwrap();
      toast.success(response.message || "Logged out successfully.");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.data?.message || "Error while logging out. Please try again."
      );
    }
  };

  return (
    <div className="w-[full]  bg-zinc-900 backdrop-blur z-50  px-35  ">
      <div className="px-4 sm:px-6 lg:px-8  ">
        <div className="flex justify-between  py-4">
          <div className="flex items-center  space-x-1">
            <div className="flex flex-col justify-center items-center">
              <img
                src="authflow.png"
                width="60px"
                alt=""
                className="rounded-md "
              />
              <span className="text-md mt-[-13px]  text-white font-bold">
                AuthFlow
              </span>
            </div>
            <div className="ml-10 hidden md:block text-sm">
              <Link
                to={"/"}
                className="text-neutral-400 cursor-pointer hover:text-neutral-50 px-2"
              >
                {" "}
                Home{" "}
              </Link>
           {user &&   <Link
                to={"/dashboard"}
                className="text-neutral-400 cursor-pointer hover:text-neutral-50 px-2"
              >
                {" "}
                Dashboard{" "}
              </Link>}
              <Link
                to={"/devdocs"}
                className="text-neutral-400 cursor-pointer hover:text-neutral-50 px-2"
              >
                {" "}
                Developer's Docs
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!user && !isLoading && (
              <Button className="cursor-pointer bg-white hover:text-red-900" variant={"ghost"}>
                <Link to={'login'}>
                Sign In
                </Link>
              </Button>
            )}

            {user && (
              <Button
                disabled={isLoading}
                className="text-black bg-white border hover:bg-red-900 hover:text-white cursor-pointer"
                onClick={logoutHandler}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
