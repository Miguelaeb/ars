"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, UserPlus, RefreshCw } from "lucide-react";
import type { Afiliado } from "@/lib/types";

export default function ConsultaAfiliadosPage() {
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [filteredAfiliados, setFilteredAfiliados] = useState<Afiliado[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadAfiliados = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/afiliados"); // Consulta la API
      if (!res.ok) throw new Error("Error al cargar afiliados");
      const data = await res.json();
      setAfiliados(data);
      setFilteredAfiliados(data);
    } catch (error) {
      console.error("Error cargando afiliados:", error);
      setAfiliados([]);
      setFilteredAfiliados([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load affiliates on component mount
  useEffect(() => {
    loadAfiliados();
  }, []);

  // Filter affiliates when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAfiliados(afiliados);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = afiliados.filter(
        (afiliado) =>
          afiliado.nombres?.toLowerCase().includes(term) ||
          afiliado.apellidos?.toLowerCase().includes(term) ||
          afiliado.cedula?.toLowerCase().includes(term) ||
          afiliado.nss?.toLowerCase().includes(term)
      );
      setFilteredAfiliados(filtered);
    }
  }, [searchTerm, afiliados]);

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "inactivo":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleRefresh = () => {
    loadAfiliados();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Consulta de Afiliados
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="icon"
            title="Refrescar lista"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/afiliados/registrar">
              <UserPlus className="mr-2 h-4 w-4" />
              Registrar Nuevo Afiliado
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Afiliados</CardTitle>
          <CardDescription>
            Consulte y gestione los afiliados registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nombre, cédula o NSS..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : filteredAfiliados.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              {afiliados.length === 0 ? (
                <>
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No hay afiliados registrados
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Comience registrando un nuevo afiliado en el sistema.
                  </p>
                  <Button asChild className="bg-teal-600 hover:bg-teal-700">
                    <Link href="/afiliados/registrar">
                      <Plus className="mr-2 h-4 w-4" />
                      Registrar Nuevo Afiliado
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Search className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No se encontraron resultados
                  </h3>
                  <p className="text-gray-500">
                    No se encontraron afiliados que coincidan con "{searchTerm}
                    ". Intente con otro término.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead>NSS</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAfiliados.map((afiliado) => (
                    <TableRow key={afiliado.id}>
                      <TableCell className="font-medium">
                        {afiliado.nombres} {afiliado.apellidos}
                      </TableCell>
                      <TableCell>{afiliado.cedula}</TableCell>
                      <TableCell>{afiliado.nss}</TableCell>
                      <TableCell>
                        {afiliado.plan === "basico"
                          ? "Básico"
                          : afiliado.plan === "estandar"
                          ? "Estándar"
                          : afiliado.plan === "premium"
                          ? "Premium"
                          : afiliado.plan === "empresarial"
                          ? "Empresarial"
                          : afiliado.plan === "senior"
                          ? "Senior"
                          : afiliado.plan === "familiar"
                          ? "Familiar"
                          : afiliado.plan}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getEstadoBadgeColor(afiliado.estado)}
                          variant="outline"
                        >
                          {afiliado.estado === "activo"
                            ? "Activo"
                            : afiliado.estado === "inactivo"
                            ? "Inactivo"
                            : afiliado.estado === "pendiente"
                            ? "Pendiente"
                            : afiliado.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/afiliados/${afiliado.id}`}>
                            Ver Detalles
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
