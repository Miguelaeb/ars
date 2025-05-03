"use client";

import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  DollarSign,
  User,
  Building,
  Loader2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { DbService } from "@/lib/db-service";
import type { Factura, Autorizacion, Afiliado } from "@/lib/types";
import { updateFacturaStatus } from "../actions";
import { useRouter } from "next/navigation";

export default function ValidarFacturasPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [facturasPendientes, setFacturasPendientes] = useState<Factura[]>([]);
  const [facturaSeleccionada, setFacturaSeleccionada] =
    useState<Factura | null>(null);
  const [autorizacion, setAutorizacion] = useState<Autorizacion | null>(null);
  const [afiliado, setAfiliado] = useState<Afiliado | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "aprobar" | "rechazar" | null
  >(null);
  const [comentarios, setComentarios] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Cargar facturas pendientes al montar el componente
  useEffect(() => {
    const cargarFacturasPendientes = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/facturas");
        const facturas = await res.json();

        const pendientes = facturas.filter(
          (f) => f.estado === "pendiente" || f.estado === "en_revision"
        );
        setFacturasPendientes(pendientes);
        if (pendientes.length > 0) {
          setFacturaSeleccionada(pendientes[0]);
        }
      } catch (error) {
        console.error("Error al cargar facturas:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las facturas pendientes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    cargarFacturasPendientes();
  }, [toast]);

  // Cargar detalles de la autorización y afiliado cuando se selecciona una factura
  useEffect(() => {
    const cargarDetalles = async () => {
      if (facturaSeleccionada) {
        try {
          // Obtener autorización
          const resAut = await fetch(
            `/api/autorizaciones/${facturaSeleccionada.autorizacionId}`
          );
          const autorizacionData: Autorizacion = await resAut.json();
          setAutorizacion(autorizacionData);

          // Obtener afiliado si hay autorización
          if (autorizacionData?.afiliadoId) {
            const resAfi = await fetch(
              `/api/afiliados/${autorizacionData.afiliadoId}`
            );
            const afiliadoData: Afiliado = await resAfi.json();
            setAfiliado(afiliadoData);
          }
        } catch (error) {
          console.error("Error al cargar detalles:", error);
        }
      } else {
        setAutorizacion(null);
        setAfiliado(null);
      }
    };

    cargarDetalles();
  }, [facturaSeleccionada]);

  const handleSelectFactura = (factura: Factura) => {
    setFacturaSeleccionada(factura);
    setComentarios("");
  };

  const confirmarAccion = (accion: "aprobar" | "rechazar") => {
    setConfirmAction(accion);
    setShowConfirmDialog(true);
  };

  const ejecutarAccion = async () => {
    if (!facturaSeleccionada || !confirmAction) return;

    setActionLoading(true);

    const formData = new FormData();
    formData.append("facturaId", facturaSeleccionada.id);
    formData.append(
      "estado",
      confirmAction === "aprobar" ? "pagada" : "rechazada"
    );
    formData.append("comentarios", comentarios);

    try {
      const result = await updateFacturaStatus(formData);

      if (result.success) {
        toast({
          title: `Factura ${
            confirmAction === "aprobar" ? "aprobada" : "rechazada"
          }`,
          description: result.message,
        });

        // Actualizar la lista de facturas pendientes
        setFacturasPendientes((prevFacturas) =>
          prevFacturas.filter((f) => f.id !== facturaSeleccionada.id)
        );

        // Seleccionar la siguiente factura si hay alguna
        if (facturasPendientes.length > 1) {
          const currentIndex = facturasPendientes.findIndex(
            (f) => f.id === facturaSeleccionada.id
          );
          const nextIndex =
            currentIndex < facturasPendientes.length - 1 ? currentIndex + 1 : 0;
          setFacturaSeleccionada(facturasPendientes[nextIndex]);
        } else {
          setFacturaSeleccionada(null);
        }

        setComentarios("");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al actualizar factura:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/facturacion">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Validar Facturas</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <span className="ml-3 text-xl">Cargando facturas...</span>
        </div>
      ) : facturasPendientes.length === 0 ? (
        <Alert>
          <AlertTitle>No hay facturas pendientes</AlertTitle>
          <AlertDescription>
            No hay facturas pendientes de validación en este momento.
            <div className="mt-4">
              <Button asChild>
                <Link href="/facturacion">Volver al listado de facturas</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Facturas Pendientes</CardTitle>
              <CardDescription>
                Facturas que requieren validación ({facturasPendientes.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Emisión</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {facturasPendientes.map((factura) => (
                        <TableRow
                          key={factura.id}
                          className={
                            facturaSeleccionada?.id === factura.id
                              ? "bg-muted"
                              : ""
                          }
                          onClick={() => handleSelectFactura(factura)}
                        >
                          <TableCell className="font-medium">
                            {factura.numeroFactura}
                          </TableCell>
                          <TableCell>{factura.fechaEmision}</TableCell>
                          <TableCell>
                            RD${" "}
                            {factura.montoTotal.toLocaleString("es-DO", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                factura.estado === "pendiente"
                                  ? "border-yellow-500 text-yellow-600 bg-yellow-50"
                                  : "border-purple-500 text-purple-600 bg-purple-50"
                              }
                            >
                              {factura.estado === "pendiente"
                                ? "Pendiente"
                                : "En Revisión"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSelectFactura(factura)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            {facturaSeleccionada ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Detalles de la Factura</CardTitle>
                        <CardDescription>
                          Factura {facturaSeleccionada.numeroFactura}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          facturaSeleccionada.estado === "pendiente"
                            ? "border-yellow-500 text-yellow-600 bg-yellow-50"
                            : "border-purple-500 text-purple-600 bg-purple-50"
                        }
                      >
                        {facturaSeleccionada.estado === "pendiente"
                          ? "Pendiente"
                          : "En Revisión"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="factura">
                      <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="factura">Factura</TabsTrigger>
                        <TabsTrigger value="autorizacion">
                          Autorización
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="factura" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <p className="text-sm font-medium text-gray-500">
                                Número de Factura
                              </p>
                            </div>
                            <p>{facturaSeleccionada.numeroFactura}</p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <p className="text-sm font-medium text-gray-500">
                                Fecha de Emisión
                              </p>
                            </div>
                            <p>{facturaSeleccionada.fechaEmision}</p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <p className="text-sm font-medium text-gray-500">
                                Fecha de Recepción
                              </p>
                            </div>
                            <p>{facturaSeleccionada.fechaRecepcion}</p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              <p className="text-sm font-medium text-gray-500">
                                Monto Total
                              </p>
                            </div>
                            <p className="font-bold">
                              RD${" "}
                              {facturaSeleccionada.montoTotal.toLocaleString(
                                "es-DO",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-500" />
                              <p className="text-sm font-medium text-gray-500">
                                Prestador
                              </p>
                            </div>
                            <p>{facturaSeleccionada.prestadorId}</p>
                          </div>
                        </div>

                        {facturaSeleccionada.comentarios && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500 mb-1">
                              Comentarios
                            </p>
                            <p className="text-sm">
                              {facturaSeleccionada.comentarios}
                            </p>
                          </div>
                        )}

                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Documentos Adjuntos
                          </p>
                          <div className="rounded-md border p-3 text-center">
                            <p className="text-sm text-gray-500">
                              {facturaSeleccionada.documentos?.facturaEscaneada
                                ? "Documento adjunto: Factura escaneada"
                                : "No hay documentos adjuntos"}
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="autorizacion" className="space-y-4">
                        {autorizacion ? (
                          <>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">
                                  {autorizacion.numeroAutorizacion}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Servicio: {autorizacion.tipoServicio}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="border-green-500 text-green-600 bg-green-50"
                              >
                                Aprobada
                              </Badge>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">
                                  Médico Tratante
                                </p>
                                <p>
                                  {autorizacion.medicoTratante ||
                                    "No especificado"}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">
                                  Fecha de Servicio
                                </p>
                                <p>{autorizacion.fechaServicio}</p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">
                                  Monto Estimado
                                </p>
                                <p>
                                  RD${" "}
                                  {autorizacion.montoEstimado.toLocaleString(
                                    "es-DO",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">
                                  Cobertura
                                </p>
                                <p>{autorizacion.porcentajeCobertura}%</p>
                              </div>
                            </div>

                            <Separator />

                            {afiliado && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <p className="text-sm font-medium text-gray-500">
                                    Afiliado
                                  </p>
                                </div>
                                <p>
                                  {afiliado.nombres} {afiliado.apellidos}
                                </p>
                                <p className="text-sm text-gray-500">
                                  NSS: {afiliado.nss}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Cédula: {afiliado.cedula}
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500">
                              No se encontró la información de la autorización
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Validación de Factura</CardTitle>
                    <CardDescription>
                      Revise la información y apruebe o rechace la factura
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="comentarios">Comentarios</Label>
                        <Textarea
                          id="comentarios"
                          placeholder="Agregue comentarios sobre la validación de esta factura"
                          value={comentarios}
                          onChange={(e) => setComentarios(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="destructive"
                      onClick={() => confirmarAccion("rechazar")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Rechazar
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => confirmarAccion("aprobar")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aprobar
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">
                      Seleccione una factura para revisar
                    </p>
                    <ArrowLeft className="h-8 w-8 text-gray-400 mx-auto animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "aprobar"
                ? "Confirmar aprobación"
                : "Confirmar rechazo"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "aprobar"
                ? "¿Está seguro que desea aprobar esta factura? Se marcará como pagada."
                : "¿Está seguro que desea rechazar esta factura? Esta acción no se puede deshacer."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={ejecutarAccion}
              disabled={actionLoading}
              className={
                confirmAction === "aprobar"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : confirmAction === "aprobar" ? (
                "Confirmar aprobación"
              ) : (
                "Confirmar rechazo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
