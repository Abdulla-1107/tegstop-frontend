import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Calendar, AlertCircle } from 'lucide-react';
import { recordsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { toast } from 'sonner';
import type { Record } from '@/types';

export default function Home() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    passportSeriya: '',
    passportCode: '',
  });
  const [result, setResult] = useState<Record | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchParams.passportSeriya || !searchParams.passportCode) {
      toast.error(t('common.error'));
      return;
    }

    if (searchParams.passportCode.length !== 6) {
      toast.error(t('addRecord.passportCodeHelper'));
      return;
    }

    setLoading(true);
    setSearched(false);
    try {
      const data = await recordsAPI.search(searchParams);
      setResult(data);
      setSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (type: string) => {
    return type === 'NasiyaMijoz' ? t('record.statusNasiya') : t('record.statusUnpaid');
  };

  const getStatusColor = (type: string) => {
    return type === 'NasiyaMijoz' ? 'text-warning' : 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">{t('search.title')}</h1>
          <p className="text-muted-foreground">{t('app.title')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t('search.title')}
              </CardTitle>
              <CardDescription>
                {t('search.passportSeries')} {t('search.passportCode')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passportSeriya">{t('search.passportSeries')}</Label>
                    <Select
                      value={searchParams.passportSeriya}
                      onValueChange={(value) =>
                        setSearchParams({ ...searchParams, passportSeriya: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('search.passportSeries')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AD">AD</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="KA">KA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passportCode">{t('search.passportCode')}</Label>
                    <Input
                      id="passportCode"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={searchParams.passportCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setSearchParams({ ...searchParams, passportCode: value });
                      }}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Search className="mr-2 h-4 w-4" />
                  {loading ? t('common.loading') : t('search.searchButton')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {searched && (
            <motion.div
              key={result ? 'found' : 'notfound'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              {result ? (
                <Card className="shadow-lg border-2 border-primary/20">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <CardTitle className="text-2xl">
                      {result.name && result.surname
                        ? `${result.name} ${result.surname}`
                        : result.name || result.surname || t('record.fullName')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <AlertCircle className={`h-5 w-5 mt-0.5 ${getStatusColor(result.type)}`} />
                      <div>
                        <p className="font-medium text-sm text-muted-foreground mb-1">
                          {t('record.status')}
                        </p>
                        <p className={`font-semibold text-lg ${getStatusColor(result.type)}`}>
                          {getStatusText(result.type)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <User className="h-5 w-5 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium text-sm text-muted-foreground mb-1">
                          {t('record.addedBy')}
                        </p>
                        <p className="font-semibold">{result.user?.name || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <Calendar className="h-5 w-5 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium text-sm text-muted-foreground mb-1">
                          {t('record.addedAt')}
                        </p>
                        <p className="font-semibold">
                          {new Date(result.createdAt).toLocaleDateString('uz-UZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg border-2 border-muted">
                  <CardContent className="pt-6 text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4"
                    >
                      <AlertCircle className="h-10 w-10 text-muted-foreground" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{t('search.notFound')}</h3>
                    <p className="text-muted-foreground">{t('search.notFoundDesc')}</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
