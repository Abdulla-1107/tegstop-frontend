import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { recordsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import type { CreateRecordData } from "@/types";
import { useFraudsters } from "@/hooks/useFraudster";

export default function AddRecord() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createFraudster } = useFraudsters();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateRecordData>({
    name: "",
    surname: "",
    passportSeriya: "AD",
    passportCode: "",
    type: "NasiyaMijoz",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.passportSeriya || !formData.passportCode) {
      toast.error(t("common.error"));
      return;
    }

    if (formData.passportCode.length !== 7) {
      toast.error(t("addRecord.passportCodeHelper"));
      return;
    }

    setLoading(true);
    try {
      await createFraudster.mutateAsync(formData); // ✅ BU YER ASOSIY
      toast.success(t("addRecord.success"));
      navigate("/my-records");
    } catch (error: any) {
      console.error("Create fraudster error:", error);
      toast.error(error.response?.data?.message || t("addRecord.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ MUHIM!! RETURN YO‘Q BO‘LSA JSX CHIQMAYDI
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">{t("addRecord.title")}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {t("addRecord.title")}
              </CardTitle>
              <CardDescription>To'liq ma'lumotlarni kiriting</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("addRecord.name")}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("addRecord.name")}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surname">{t("addRecord.surname")}</Label>
                    <Input
                      id="surname"
                      type="text"
                      placeholder={t("addRecord.surname")}
                      value={formData.surname}
                      onChange={(e) =>
                        setFormData({ ...formData, surname: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passportSeriya">
                      {t("addRecord.passportSeries")}
                    </Label>
                    <Select
                      value={formData.passportSeriya}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, passportSeriya: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AD">AD</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="KA">KA</SelectItem>
                        <SelectItem value="AE">AE</SelectItem>
                        <SelectItem value="AC">AC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passportCode">
                      {t("addRecord.passportCode")}
                    </Label>
                    <Input
                      id="passportCode"
                      type="text"
                      placeholder="1234567"
                      maxLength={7}
                      value={formData.passportCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, passportCode: value });
                      }}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("addRecord.passportCodeHelper")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>{t("addRecord.type")}</Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, type: value })
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="NasiyaMijoz" id="nasiya" />
                      <Label htmlFor="nasiya" className="flex-1 cursor-pointer">
                        {t("addRecord.typeNasiya")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="PulTolamagan" id="unpaid" />
                      <Label htmlFor="unpaid" className="flex-1 cursor-pointer">
                        {t("addRecord.typeUnpaid")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("common.loading")}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      {t("addRecord.submit")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
