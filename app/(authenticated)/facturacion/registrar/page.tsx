"use client";

import type React from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, CheckCircle2, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DbService } from "@/lib/db-service";
import type { Autorizacion, Afiliado } from "@/lib/types";
import { createFactura } from "../actions";

export default function RegistrarFacturaPage() {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autorizacionesAprobadas, setAutorizacionesAprobadas] = useState<
    Autorizacion[]
  >([]);
  const [autorizacionSeleccionada, setAutorizacionSeleccionada] =
    useState<Autorizacion | null>(null);
  const [afiliado, setAfiliado] = useState<Afiliado | null>(null);
  const [formData, setFormData] = useState({
    numeroFactura: "",
    fechaEmision: new Date().toISOString().split("T")[0],
    fechaRecepcion: new Date().toISOString().split("T")[0],
    montoTotal: 0,
    estado: "pendiente",
    comentarios: "",
  });

  // Cargar autorizaciones aprobadas al montar el componente
  useEffect(() => {
    const cargarAutorizacionesAprobadas = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/autorizaciones");
        const data: Autorizacion[] = await res.json();

        // Filtrar por estado "aprobada"
        const aprobadas = data.filter((a) => a.estado === "aprobada");
        setAutorizacionesAprobadas(aprobadas);
      } catch (error) {
        console.error("Error al cargar autorizaciones:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las autorizaciones aprobadas",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    cargarAutorizacionesAprobadas();
  }, [toast]);

  // Cargar información del afiliado cuando se selecciona una autorización
  useEffect(() => {
    const cargarAfiliado = async () => {
      if (autorizacionSeleccionada) {
        try {
          const res = await fetch(
            `/api/afiliados/${autorizacionSeleccionada.afiliadoId}`
          );
          const afiliadoData: Afiliado = await res.json();
          setAfiliado(afiliadoData);

          // Establecer el monto total basado en el monto estimado de la autorización
          setFormData((prev) => ({
            ...prev,
            montoTotal: autorizacionSeleccionada.montoEstimado,
          }));
        } catch (error) {
          console.error("Error al cargar afiliado:", error);
        }
      } else {
        setAfiliado(null);
      }
    };

    cargarAfiliado();
  }, [autorizacionSeleccionada]);

  const handleSelectAutorizacion = (autorizacionId: string) => {
    const autorizacion =
      autorizacionesAprobadas.find((a) => a.id === autorizacionId) || null;
    setAutorizacionSeleccionada(autorizacion);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "montoTotal" ? Number.parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!autorizacionSeleccionada) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar una autorización aprobada",
        variant: "destructive",
      });
      return;
    }

    if (!formData.numeroFactura) {
      toast({
        title: "Error de validación",
        description: "Debe ingresar un número de factura",
        variant: "destructive",
      });
      return;
    }

    if (formData.montoTotal <= 0) {
      toast({
        title: "Error de validación",
        description: "El monto total debe ser mayor que cero",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    if (!autorizacionSeleccionada) return;

    setLoading(true);

    const formDataObj = new FormData();
    formDataObj.append("autorizacionId", autorizacionSeleccionada.id);
    formDataObj.append("prestadorId", autorizacionSeleccionada.prestador);
    formDataObj.append("numeroFactura", formData.numeroFactura);
    formDataObj.append("fechaEmision", formData.fechaEmision);
    formDataObj.append("fechaRecepcion", formData.fechaRecepcion);
    formDataObj.append("montoTotal", formData.montoTotal.toString());
    formDataObj.append("estado", formData.estado);
    formDataObj.append("montoPagado", "0");
    formDataObj.append("comentarios", formData.comentarios);

    try {
      const result = await createFactura(formDataObj);

      if (result.success) {
        setFormSubmitted(true);
        setShowConfirmation(false);
        toast({
          title: "Factura registrada",
          description: result.message,
        });
      } else {
        setShowConfirmation(false);
        toast({
          title: "Error al registrar factura",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al registrar factura:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/facturacion">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            Registrar Factura
          </h1>
        </div>
      </div>

      {formSubmitted ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Factura registrada</AlertTitle>
          <AlertDescription>
            La factura ha sido registrada correctamente en el sistema.
            <div className="mt-4">
              <Button asChild>
                <Link href="/facturacion">Ver listado de facturas</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Autorización Aprobada</CardTitle>
                <CardDescription>
                  Seleccione una autorización médica aprobada para facturar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Cargando autorizaciones...</span>
                  </div>
                ) : autorizacionesAprobadas.length === 0 ? (
                  <Alert>
                    <AlertTitle>No hay autorizaciones aprobadas</AlertTitle>
                    <AlertDescription>
                      No se encontraron autorizaciones médicas aprobadas para
                      facturar.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="autorizacion">
                        Autorización <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelectAutorizacion(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una autorización" />
                        </SelectTrigger>
                        <SelectContent>
                          {autorizacionesAprobadas.map((autorizacion) => (
                            <SelectItem
                              key={autorizacion.id}
                              value={autorizacion.id}
                            >
                              {autorizacion.numeroAutorizacion} -{" "}
                              {autorizacion.tipoServicio}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {autorizacionSeleccionada && (
                      <div className="rounded-md border p-4 mt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              Autorización:{" "}
                              {autorizacionSeleccionada.numeroAutorizacion}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Servicio: {autorizacionSeleccionada.tipoServicio}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="border-green-500 text-green-600 bg-green-50"
                          >
                            Aprobada
                          </Badge>
                        </div>
                        <Separator className="my-3" />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Prestador
                            </p>
                            <p className="text-sm">
                              {autorizacionSeleccionada.prestador}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Médico Tratante
                            </p>
                            <p className="text-sm">
                              {autorizacionSeleccionada.medicoTratante ||
                                "No especificado"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Fecha de Servicio
                            </p>
                            <p className="text-sm">
                              {autorizacionSeleccionada.fechaServicio}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Monto Estimado
                            </p>
                            <p className="text-sm">
                              RD${" "}
                              {autorizacionSeleccionada.montoEstimado.toLocaleString(
                                "es-DO",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        {afiliado && (
                          <>
                            <Separator className="my-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Afiliado
                              </p>
                              <p className="text-sm">
                                {afiliado.nombres} {afiliado.apellidos}
                              </p>
                              <p className="text-sm text-gray-500">
                                NSS: {afiliado.nss}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de la Factura</CardTitle>
                <CardDescription>
                  Ingrese los datos generales de la factura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroFactura">
                      Número de Factura <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="numeroFactura"
                      name="numeroFactura"
                      value={formData.numeroFactura}
                      onChange={handleInputChange}
                      placeholder="Ingrese el número de factura"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaEmision">
                      Fecha de Emisión <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fechaEmision"
                      name="fechaEmision"
                      type="date"
                      value={formData.fechaEmision}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechaRecepcion">
                      Fecha de Recepción <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fechaRecepcion"
                      name="fechaRecepcion"
                      type="date"
                      value={formData.fechaRecepcion}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="montoTotal">
                      Monto Total (RD$) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="montoTotal"
                      name="montoTotal"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.montoTotal}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">
                      Estado <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      defaultValue={formData.estado}
                      onValueChange={(value) =>
                        handleSelectChange("estado", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="en_revision">En Revisión</SelectItem>
                        <SelectItem value="pagada">Pagada</SelectItem>
                        <SelectItem value="pago_parcial">
                          Pago Parcial
                        </SelectItem>
                        <SelectItem value="rechazada">Rechazada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentación</CardTitle>
                <CardDescription>
                  Adjunte la documentación requerida para la factura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="facturaEscaneada">
                      Factura Escaneada <span className="text-red-500">*</span>
                    </Label>
                    <Input id="facturaEscaneada" type="file" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="documentosSoporte">
                      Documentos de Soporte
                    </Label>
                    <Input
                      id="documentosSoporte"
                      type="file"
                      multiple
                      className="mt-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comentarios">Comentarios</Label>
                    <Textarea
                      id="comentarios"
                      name="comentarios"
                      value={formData.comentarios}
                      onChange={handleInputChange}
                      placeholder="Ingrese comentarios adicionales sobre la factura"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href="/facturacion">Cancelar</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Registrar Factura
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      )}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar registro</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea registrar esta factura por un monto de RD${" "}
              {formData.montoTotal.toLocaleString("es-DO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmSubmit}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
