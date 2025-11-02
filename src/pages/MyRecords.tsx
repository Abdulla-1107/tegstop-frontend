import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { recordsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { toast } from 'sonner';
import type { Record } from '@/types';

export default function MyRecords() {
  const { t } = useTranslation();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await recordsAPI.getMyRecords();
      setRecords(data);
    } catch (error) {
      console.error('Load records error:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    return type === 'NasiyaMijoz' ? t('myRecords.typeNasiya') : t('myRecords.typeUnpaid');
  };

  const getTypeBadgeVariant = (type: string) => {
    return type === 'NasiyaMijoz' ? 'default' : 'destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('myRecords.title')}</h1>
            <p className="text-muted-foreground">{records.length} {t('myRecords.title').toLowerCase()}</p>
          </div>
          <Link to="/add-record">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              {t('nav.addRecord')}
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t('common.loading')}</p>
              </CardContent>
            </Card>
          ) : records.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4"
                >
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{t('myRecords.noRecords')}</h3>
                <p className="text-muted-foreground mb-4">{t('myRecords.noRecordsDesc')}</p>
                <Link to="/add-record">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('nav.addRecord')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>{t('myRecords.title')}</CardTitle>
                <CardDescription>{records.length} yozuv topildi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('myRecords.name')}</TableHead>
                        <TableHead>{t('myRecords.surname')}</TableHead>
                        <TableHead>{t('myRecords.passport')}</TableHead>
                        <TableHead>{t('myRecords.type')}</TableHead>
                        <TableHead>{t('myRecords.created')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record, index) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {record.name || '-'}
                          </TableCell>
                          <TableCell>{record.surname || '-'}</TableCell>
                          <TableCell>
                            <code className="px-2 py-1 bg-muted rounded text-sm">
                              {record.passportSeriya} {record.passportCode}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getTypeBadgeVariant(record.type)}>
                              {getTypeLabel(record.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(record.createdAt).toLocaleDateString('uz-UZ', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
