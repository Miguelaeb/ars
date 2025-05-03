"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  FileText,
  ListChecks,
  PlusCircle,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  FilePlus2,
  Search,
  ClipboardList,
} from "lucide-react";

export default function FacturacionPage() {
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const res = await fetch("/api/facturas/pendientes");
        const data = await res.json();
        if (res.ok) setPendientes(data.total);
      } catch (err) {
        console.error("Error al obtener facturas pendientes:", err);
      }
    };

    fetchPendientes();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Facturación</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Registrar Factura</CardTitle>
            <CardDescription>
              Registre una nueva factura en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-md bg-gray-100 p-3 w-full">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-purple-500/20 p-2">
                    <FilePlus2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      Complete el formulario
                    </div>
                    <div className="text-xs text-gray-500">
                      Ingrese todos los detalles de la factura
                    </div>
                  </div>
                </div>
              </div>
              <Button
                asChild
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Link href="/facturacion/registrar">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nueva Factura
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Validar Facturas</CardTitle>
            <CardDescription>
              Revise, apruebe o rechace facturas pendientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-md bg-gray-100 p-3 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 rounded-full bg-yellow-500/20 p-2">
                      <CheckCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Facturas pendientes
                      </div>
                      <div className="text-xs text-gray-500">
                        Requieren validación
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-yellow-500 text-yellow-600 bg-yellow-50"
                  >
                    {pendientes}
                  </Badge>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/facturacion/validar">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Revisar y Validar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Lista de Facturas</CardTitle>
            <CardDescription>
              Consulte todas las facturas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-md bg-gray-100 p-3 w-full">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-blue-500/20 p-2">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      Ver todas las facturas
                    </div>
                    <div className="text-xs text-gray-500">
                      Administre y filtre facturas
                    </div>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/facturacion/lista">
                  <Search className="mr-2 h-4 w-4" />
                  Ver Listado
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Consultar Estado</CardTitle>
            <CardDescription>
              Verifique el estado de facturas por ID o proveedor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-md bg-gray-100 p-3 w-full">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-cyan-500/20 p-2">
                    <Search className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Consulta rápida</div>
                    <div className="text-xs text-gray-500">
                      Busque por ID o proveedor
                    </div>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/facturacion/estado">
                  <Search className="mr-2 h-4 w-4" />
                  Consultar Estado
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Registrar Pago</CardTitle>
            <CardDescription>
              Registre un nuevo pago para una factura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-md bg-gray-100 p-3 w-full">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-green-500/20 p-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Procesar pagos</div>
                    <div className="text-xs text-gray-500">
                      Gestione los pagos de facturas
                    </div>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/facturacion/pagos">
                  <FileText className="mr-2 h-4 w-4" />
                  Registrar Pago
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reportes de Facturación</CardTitle>
            <CardDescription>
              Genere reportes financieros y de facturación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-md bg-gray-100 p-3 w-full">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-orange-500/20 p-2">
                    <ListChecks className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      Reportes disponibles
                    </div>
                    <div className="text-xs text-gray-500">
                      Estados financieros y análisis
                    </div>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/facturacion/reportes">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver Reportes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
