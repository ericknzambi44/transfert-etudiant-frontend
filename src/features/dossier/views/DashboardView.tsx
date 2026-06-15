import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDossier } from '../hooks/useDossier';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, CheckCircle, XCircle, Clock, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DossierTransfert, StatistiquesDTO } from '@/lib/api.types';

export default function DashboardView() {
  const { auth } = useAuth();
  const { getDossiers, getStatistiques, getMesDossiers, error } = useDossier();
  const [dossiers, setDossiers] = useState<DossierTransfert[]>([]);
  const [stats, setStats] = useState<StatistiquesDTO | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingEtudiant, setLoadingEtudiant] = useState(true);
  const [errorEtudiant, setErrorEtudiant] = useState<string | null>(null);
  const [mesDossiers, setMesDossiers] = useState<DossierTransfert[]>([]);
  const studentLoadedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Détecter le mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Chargement pour établissement
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (auth.userType !== 'ETABLISSEMENT') return;
      setLoading(true);
      timeoutRef.current = setTimeout(() => {
        if (mounted) setLoading(false);
      }, 8000);
      try {
        const [dossiersData, statsData] = await Promise.all([getDossiers(), getStatistiques()]);
        if (mounted) {
          setDossiers(dossiersData);
          setStats(statsData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(timeoutRef.current);
        }
      }
    };
    fetchData();
    return () => { mounted = false; clearTimeout(timeoutRef.current); };
  }, [auth.userType]);

  // Chargement pour étudiant (une seule fois)
  useEffect(() => {
    if (auth.userType !== 'ETUDIANT' || studentLoadedRef.current) return;
    let mounted = true;
    const fetchEtudiant = async () => {
      setLoadingEtudiant(true);
      try {
        const data = await getMesDossiers();
        if (mounted) {
          setMesDossiers(data);
          studentLoadedRef.current = true;
        }
      } catch (err: any) {
        if (mounted) setErrorEtudiant(err.message);
      } finally {
        if (mounted) setLoadingEtudiant(false);
      }
    };
    fetchEtudiant();
    return () => { mounted = false; };
  }, [auth.userType]);

  // Vue étudiant (optimisée mobile)
  if (auth.userType === 'ETUDIANT') {
    if (loadingEtudiant && mesDossiers.length === 0 && !errorEtudiant) {
      return (
        <div className="space-y-4 px-2">
          <Skeleton className="h-10 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      );
    }
    if (errorEtudiant) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-500 text-sm">{errorEtudiant}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      );
    }
    return (
      <div className="space-y-4 px-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Mes dossiers
        </h1>
        {mesDossiers.length === 0 ? (
          <Card className="card-inner">
            <CardContent className="p-6 text-center">
              <FileText className="h-10 w-10 mx-auto text-primary mb-3" />
              <p className="text-sm text-muted-foreground">Aucun dossier pour le moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {mesDossiers.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow transition">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{d.etudiantPrenom} {d.etudiantNom}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.etudiantEmail}</p>
                  <Badge variant={d.statut === 'ACCEPTE' ? 'default' : 'secondary'} className="mt-1 text-xs">{d.statut}</Badge>
                </div>
                <Link to={`/dossiers/${d.id}`} className="ml-2">
                  <Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Vue établissement
  if (loading) {
    return (
      <div className="space-y-4 px-2">
        <Skeleton className="h-10 w-40" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-48 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-500 text-sm">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  const statsCards = stats && (
    <div className="grid grid-cols-2 gap-3">
      <Card className="card-inner">
        <CardContent className="p-3 flex items-center justify-between">
          <div><p className="text-xs text-muted-foreground">Total</p><p className="text-xl font-bold">{stats.totalDossiers}</p></div>
          <FileText className="h-5 w-5 text-primary" />
        </CardContent>
      </Card>
      <Card className="card-inner">
        <CardContent className="p-3 flex items-center justify-between">
          <div><p className="text-xs text-muted-foreground">Acceptés</p><p className="text-xl font-bold text-green-600">{stats.dossiersAcceptes}</p></div>
          <CheckCircle className="h-5 w-5 text-green-500" />
        </CardContent>
      </Card>
      <Card className="card-inner">
        <CardContent className="p-3 flex items-center justify-between">
          <div><p className="text-xs text-muted-foreground">Refusés</p><p className="text-xl font-bold text-red-600">{stats.dossiersRefuses}</p></div>
          <XCircle className="h-5 w-5 text-red-500" />
        </CardContent>
      </Card>
      <Card className="card-inner">
        <CardContent className="p-3 flex items-center justify-between">
          <div><p className="text-xs text-muted-foreground">En cours</p><p className="text-xl font-bold text-yellow-600">{stats.dossiersEnCours}</p></div>
          <Clock className="h-5 w-5 text-yellow-500" />
        </CardContent>
      </Card>
    </div>
  );

  const chartData = stats ? [
    { name: 'Acceptés', value: stats.dossiersAcceptes, color: '#10b981' },
    { name: 'Refusés', value: stats.dossiersRefuses, color: '#ef4444' },
    { name: 'En cours', value: stats.dossiersEnCours, color: '#eab308' },
  ] : [];

  const chart = !isMobile && stats && (stats.dossiersAcceptes + stats.dossiersRefuses + stats.dossiersEnCours) > 0 && (
    <Card className="card-inner">
      <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Répartition</CardTitle></CardHeader>
      <CardContent>
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => [`${value} dossier(s)`, '']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 px-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Tableau de bord
        </h1>
        <Link to="/dossiers/creer"><Button size="sm" className="btn-elite text-sm">+ Dossier</Button></Link>
      </div>

      {statsCards}

      {chart}

      <Card className="card-inner">
        <CardHeader><CardTitle className="text-lg">Dossiers récents</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {dossiers.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">Aucun dossier</p>
          ) : (
            dossiers.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center justify-between p-2 rounded-lg border bg-card hover:shadow transition">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{d.etudiantPrenom} {d.etudiantNom}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.etudiantEmail}</p>
                </div>
                <Badge variant={d.statut === 'ACCEPTE' ? 'default' : 'secondary'} className="text-xs">{d.statut}</Badge>
                <Link to={`/dossiers/${d.id}`} className="ml-2">
                  <Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}