import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/hooks";
import { Lock, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-zinc-900 flex flex-col overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between px-8 py-20 max-w-7xl mx-auto w-full gap-10">
          {/* LEFT COLUMN */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-red-50 mb-6 leading-tight">
              AuthFlow
            </h1>
            <p className="text-lg text-red-50 mb-8">
              A modern, secure authentication platform with advanced session
              management and administrative controls.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {user ? (
                <Button size={"lg"} className="bg-red-600 hover:bg-red-700">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button size={"lg"} className="bg-red-600 hover:bg-red-700">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:bg-zinc-100/90"
                  >
                    <Link to="/register">Create Account</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:w-1/2 grid sm:grid-cols-2 gap-6">
            <Card className="text-center bg-zinc-800 border-0 shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-700 rounded-md flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-red-50 text-base">
                  Secure Auth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-red-100 text-sm">
                  Supports custom login and Google OAuth for strong, flexible
                  authentication.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center bg-zinc-800 border-0 shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-700 rounded-md flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-red-50 text-base">
                  Session Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-red-100 text-sm">
                  Track, manage, and revoke sessions across multiple devices
                  with ease.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center bg-zinc-800 border-0 shadow-md hover:shadow-xl transition-shadow sm:col-span-2">
              <CardHeader>
                <div className="w-12 h-12 bg-red-700 rounded-md flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-red-50 text-base">
                  Admin Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-red-100 text-sm">
                  Manage users with role-based access, audit logs, and session
                  visibility.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
