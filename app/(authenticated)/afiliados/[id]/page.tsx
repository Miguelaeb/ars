"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Edit,
  FileText,
  User,
  Users,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { AfiliadoInfoCard } from "@/components/afiliados/afiliado-info-card";
import { DependientesTable } from "@/components/afiliados/dependientes-table";
import { HistorialReclamaciones } from "@/components/afiliados/historial-reclamaciones";
import type { Afiliado, Dependiente } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AfiliadoDetallePage() {
  const { id } = useParams() as { id: string };
  const [afiliado, setAfiliado] = useState<Afiliado | null>(null);
  const [dependientes, setDependientes] = useState<Dependiente[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("Afiliado ID:", id);

    const fetchAfiliadoData = async () => {
      try {
        if (!id) throw new Error("ID inválido");
        setLoading(true);

        const resAfiliado = await fetch(`/api/afiliados/${id}`);
        if (!resAfiliado.ok) throw new Error("Afiliado no encontrado");
        const afiliadoData = await resAfiliado.json();
        setAfiliado(afiliadoData);

        const resDependientes = await fetch(
          `/api/afiliados/${id}/dependientes`
        );
        const dependientesData = await resDependientes.json();
        setDependientes(dependientesData);
      } catch (error) {
        console.error("Error al cargar datos del afiliado:", error);
        router.push("/afiliados");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAfiliadoData();
    }
  }, [id, router]);

  if (loading) return <AfiliadoDetailSkeleton />;

  if (!afiliado) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-2">Afiliado no encontrado</h2>
        <p className="text-gray-500 mb-4">
          No se encontró información para el afiliado solicitado.
        </p>
        <Button asChild>
          <Link href="/afiliados">Volver a la lista de afiliados</Link>
        </Button>
      </div>
    );
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "activo":
        return (
          <Badge
            variant="outline"
            className="ml-2 border-green-500 text-green-600 bg-green-50"
          >
            Activo
          </Badge>
        );
      case "inactivo":
        return (
          <Badge
            variant="outline"
            className="ml-2 border-red-500 text-red-600 bg-red-50"
          >
            Inactivo
          </Badge>
        );
      case "pendiente":
        return (
          <Badge
            variant="outline"
            className="ml-2 border-yellow-500 text-yellow-600 bg-yellow-50"
          >
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="ml-2">
            {estado}
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/afiliados">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            Detalle de Afiliado
          </h1>
          {getEstadoBadge(afiliado.estado)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button asChild>
            <Link href={`/afiliados/editar/${afiliado.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="informacion">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="informacion">
            <User className="mr-2 h-4 w-4" />
            Información
          </TabsTrigger>
          <TabsTrigger value="dependientes">
            <Users className="mr-2 h-4 w-4" />
            Dependientes
          </TabsTrigger>
          <TabsTrigger value="reclamaciones">
            <FileText className="mr-2 h-4 w-4" />
            Reclamaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="informacion" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AfiliadoInfoCard afiliado={afiliado} />

            <Card>
              <CardHeader>
                <CardTitle>Información del Plan</CardTitle>
                <CardDescription>
                  Detalles del plan de salud actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Plan</p>
                      <p className="text-base capitalize">
                        {afiliado.plan || "No especificado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Tipo de Afiliado
                      </p>
                      <p className="text-base capitalize">
                        {afiliado.tipoAfiliado || "No especificado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Fecha de Afiliación
                      </p>
                      <p className="text-base">
                        {afiliado.fechaAfiliacion || "No especificada"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Forma de Pago
                      </p>
                      <p className="text-base capitalize">
                        {afiliado.formaPago || "No especificada"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Coberturas
                    </p>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm">Cobertura Dental</span>
                        <span className="text-sm font-medium">
                          {afiliado.coberturaDental ? "Sí" : "No"}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Cobertura Visión</span>
                        <span className="text-sm font-medium">
                          {afiliado.coberturaVision ? "Sí" : "No"}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Cobertura Internacional</span>
                        <span className="text-sm font-medium">
                          {afiliado.coberturaInternacional ? "Sí" : "No"}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Cobertura Medicamentos</span>
                        <span className="text-sm font-medium">
                          {afiliado.coberturaMedicamentos ? "Sí" : "No"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dependientes" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dependientes</CardTitle>
                <CardDescription>
                  Listado de dependientes asociados al afiliado
                </CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link
                  href={`/afiliados/dependientes/agregar?afiliadoId=${afiliado.id}`}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Dependiente
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <DependientesTable dependientes={dependientes} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reclamaciones" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Reclamaciones</CardTitle>
              <CardDescription>
                Reclamaciones realizadas por el afiliado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HistorialReclamaciones afiliadoId={afiliado.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AfiliadoDetailSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <Skeleton className="h-12 w-full max-w-md" />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="grid grid-cols-2 gap-4">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
