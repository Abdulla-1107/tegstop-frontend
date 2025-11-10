import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FileText, Plus, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import type { Record } from "@/types";
import { useFraudsters } from "@/hooks/useFraudster";
import { recordsAPI } from "@/lib/api";

export default function MyRecords() {
  const { t } = useTranslation();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const { getFraudsterMyCount, deleteFraudster } = useFraudsters();
  const { data } = getFraudsterMyCount();

  const recordsData = data?.data || [];
  console.log("Fraudster data:", recordsData);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await recordsAPI.getMyRecords();
      setRecords(data);
    } catch (error) {
      console.error("Load records error:", error);
      toast.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    return type === "NasiyaMijoz"
      ? t("myRecords.typeNasiya")
      : t("myRecords.typeUnpaid");
  };

  const getTypeBadgeVariant = (type: string) => {
    return type === "NasiyaMijoz" ? "default" : "destructive";
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">{t("myRecords.title")}</h1>
            <p className="text-muted-foreground">
              {recordsData.length} {t("myRecords.title").toLowerCase()}
            </p>
          </div>
          <Link to="/add-record">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              {t("nav.addRecord")}
            </Button>
          </Link>
        </motion.div>

        {/* Loading / Empty / Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t("common.loading")}</p>
              </CardContent>
            </Card>
          ) : recordsData.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4"
                >
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">
                  {t("myRecords.noRecords")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("myRecords.noRecordsDesc")}
                </p>
                <Link to="/add-record">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("nav.addRecord")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div
              className="
                grid 
                gap-6 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4
              "
            >
              {recordsData.map((record: any, index: number) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border border-border bg-card">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold">
                          {record.name} {record.surname}
                        </CardTitle>
                        <Badge variant={getTypeBadgeVariant(record.type)}>
                          {getTypeLabel(record.type)}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t("myRecords.passport")}
                        </span>
                        <span className="font-medium">
                          {record.passportSeriya} {record.passportCode}
                        </span>
                      </div>

                      <div className="flex items-center text-muted-foreground text-xs mt-2">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(record.createdAt).toLocaleDateString(
                          "uz-UZ",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>

                      {/* DELETE BUTTON */}
                      <div className="mt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            if (
                              confirm(
                                "Haqiqatan ham ushbu yozuvni o‘chirmoqchimisiz?"
                              )
                            ) {
                              try {
                                await deleteFraudster.mutateAsync(record.id);
                                toast.success(
                                  "Yozuv muvaffaqiyatli o‘chirildi"
                                );
                              } catch (err) {
                                console.error(err);
                                toast.error("O‘chirishda xatolik yuz berdi");
                              }
                            }
                          }}
                        >
                          o'chirish
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
