import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Phone, UserCircle, LogOut, Shield } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/hooks/api";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // 🔹 User ma'lumotni olish
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.get("user/profile").then((res) => res.data),
  });
  

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔹 Yuklanayotgan payt
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">
          {t("common.loading") || "Loading..."}
        </p>
      </div>
    );
  }

  // 🔹 Xatolik paytida
  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          {t("common.error") || "Failed to load user profile."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <UserCircle className="w-16 h-16 text-primary" />
              </motion.div>
              <CardTitle className="text-3xl font-bold">
                {t("profile.title") || "Profile"}
              </CardTitle>
              <CardDescription>
                {t("profile.userInfo") || "User Information"}
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {t("profile.name") || "Full Name"}
                  </p>
                  <p className="text-lg font-semibold">{data?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {t("profile.username") || "Username"}
                  </p>
                  <p className="text-lg font-semibold">{data?.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {t("profile.phone") || "Phone"}
                  </p>
                  <p className="text-lg font-semibold">{data?.phone}</p>
                </div>
              </div>

              {data?.role && (
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {t("profile.role") || "Role"}
                    </p>
                    <p className="text-lg font-semibold capitalize">
                      {data?.role}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  {t("profile.logoutButton") || "Logout"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
