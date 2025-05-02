"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import type { Afiliado, Dependiente } from "@/lib/types";

export default function AgregarDependientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAfiliado, setSelectedAfiliado] = useState<Afiliado | null>(
    null
  );
  const [afiliados, setAfiliados] = useState<Afiliado[]>([]);
  const [dependientes, setDependientes] = useState<Dependiente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    fechaNacimiento: new Date(),
    genero: "",
    parentesco: "",
    telefono: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchAfiliados = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/afiliados");
        const data = await response.json();
        setAfiliados(data);
      } catch (error) {
        console.error("Error al cargar afiliados:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los afiliados",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAfiliados();
  }, [toast]);

  useEffect(() => {
    const fetchDependientes = async () => {
      if (!selectedAfiliado) {
        setDependientes([]);
        return;
      }

      try {
        const res = await fetch(
          `/api/afiliados/${selectedAfiliado.id}/dependientes`
        );
        const data = await res.json();
        setDependientes(data);
      } catch (error) {
        console.error("Error al cargar dependientes:", error);
      }
    };

    fetchDependientes();
  }, [selectedAfiliado]);

  const handleSelectAfiliado = (afiliado: Afiliado) => {
    setSelectedAfiliado(afiliado);
    setIsSearchOpen(false);
    setSuccessMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, fechaNacimiento: date }));
      setIsCalendarOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      cedula: "",
      fechaNacimiento: new Date(),
      genero: "",
      parentesco: "",
      telefono: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAfiliado) {
      toast({
        title: "Error",
        description: "Debe seleccionar un afiliado",
        variant: "destructive",
      });
      return;
    }

    // Validar campos requeridos
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.genero ||
      !formData.parentesco
    ) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const nuevoDependiente = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        cedula: formData.cedula,
        fechaNacimiento: format(formData.fechaNacimiento, "yyyy-MM-dd"),
        genero: formData.genero,
        parentesco: formData.parentesco,
        telefono: formData.telefono || "",
      };

      const response = await fetch(
        `/api/afiliados/${selectedAfiliado.id}/dependientes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([nuevoDependiente]),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el dependiente");
      }

      const data = await response.json();

      // ✅ Actualizamos la lista local con el dependiente devuelto por el backend
      setDependientes((prev) => [...prev, ...data]);

      setSuccessMessage(
        `Dependiente ${formData.nombre} ${formData.apellido} agregado correctamente`
      );

      resetForm();

      toast({
        title: "Dependiente agregado",
        description: "El dependiente ha sido agregado exitosamente",
      });
    } catch (error) {
      console.error("Error al guardar dependiente:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el dependiente",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Agregar Dependientes
        </h1>
      </div>

      <div className="grid gap-5 md:grid-cols-12">
        {/* Affiliate Selection Card */}
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>Seleccionar Afiliado</CardTitle>
            <CardDescription>
              Busque y seleccione el afiliado al que desea agregar dependientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isSearchOpen}
                    className="w-full justify-between"
                  >
                    {selectedAfiliado
                      ? `${selectedAfiliado.nombres} ${selectedAfiliado.apellidos} - ${selectedAfiliado.cedula}`
                      : "Buscar afiliado..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar por nombre o cédula..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron afiliados</CommandEmpty>
                      <CommandGroup>
                        {afiliados.map((afiliado) => (
                          <CommandItem
                            key={afiliado.id}
                            value={`${afiliado.nombres} ${afiliado.apellidos} ${afiliado.cedula}`}
                            onSelect={() => handleSelectAfiliado(afiliado)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            <span>
                              {afiliado.nombres} {afiliado.apellidos} -{" "}
                              {afiliado.cedula}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedAfiliado && (
                <div className="rounded-md border p-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Nombre completo
                      </p>
                      <p className="text-base font-medium">
                        {selectedAfiliado.nombres} {selectedAfiliado.apellidos}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Cédula
                      </p>
                      <p className="text-base">{selectedAfiliado.cedula}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">NSS</p>
                      <p className="text-base">{selectedAfiliado.nss}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Plan</p>
                      <p className="text-base capitalize">
                        {selectedAfiliado.plan}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Estado
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          selectedAfiliado.estado === "activo"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : selectedAfiliado.estado === "inactivo"
                            ? "border-red-500 text-red-600 bg-red-50"
                            : "border-yellow-500 text-yellow-600 bg-yellow-50"
                        )}
                      >
                        {selectedAfiliado.estado === "activo"
                          ? "Activo"
                          : selectedAfiliado.estado === "inactivo"
                          ? "Inactivo"
                          : "Pendiente"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dependent Registration Form */}
        {selectedAfiliado && (
          <>
            <Card className="md:col-span-6">
              <CardHeader>
                <CardTitle>Registrar Dependiente</CardTitle>
                <CardDescription>
                  Complete el formulario para agregar un nuevo dependiente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  id="dependienteForm"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">
                        Nombre <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">
                        Apellido <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula o ID Temporal</Label>
                    <Input
                      id="cedula"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleInputChange}
                      placeholder="000-0000000-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaNacimiento">
                      Fecha de Nacimiento{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {formData.fechaNacimiento ? (
                            format(formData.fechaNacimiento, "dd/MM/yyyy", {
                              locale: es,
                            })
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.fechaNacimiento}
                          onSelect={handleDateChange}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Género <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.genero}
                      onValueChange={(value) =>
                        handleSelectChange("genero", value)
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="masculino" id="masculino" />
                        <Label htmlFor="masculino">Masculino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="femenino" id="femenino" />
                        <Label htmlFor="femenino">Femenino</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentesco">
                      Parentesco <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.parentesco}
                      onValueChange={(value) =>
                        handleSelectChange("parentesco", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el parentesco" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conyuge">Cónyuge</SelectItem>
                        <SelectItem value="hijo">Hijo/a</SelectItem>
                        <SelectItem value="padre">Padre</SelectItem>
                        <SelectItem value="madre">Madre</SelectItem>
                        <SelectItem value="hermano">Hermano/a</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">
                      Teléfono de contacto (opcional)
                    </Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="(000) 000-0000"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetForm}>
                  Limpiar
                </Button>
                <Button
                  type="submit"
                  form="dependienteForm"
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Guardando...
                    </div>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Guardar Dependiente
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Dependents List */}
            <Card className="md:col-span-6">
              <CardHeader>
                <CardTitle>Dependientes Registrados</CardTitle>
                <CardDescription>
                  Listado de dependientes asociados al afiliado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {successMessage && (
                  <Alert className="mb-4 bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Éxito</AlertTitle>
                    <AlertDescription className="text-green-700">
                      {successMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {dependientes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No hay dependientes registrados
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Este afiliado no tiene dependientes registrados. Complete
                      el formulario para agregar uno.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Parentesco</TableHead>
                          <TableHead>Fecha Nac.</TableHead>
                          <TableHead>Género</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dependientes.map((dependiente) => (
                          <TableRow key={dependiente.id}>
                            <TableCell className="font-medium">
                              {dependiente.nombre} {dependiente.apellido}
                            </TableCell>
                            <TableCell className="capitalize">
                              {dependiente.parentesco === "conyuge"
                                ? "Cónyuge"
                                : dependiente.parentesco === "hijo"
                                ? "Hijo/a"
                                : dependiente.parentesco === "padre"
                                ? "Padre"
                                : dependiente.parentesco === "madre"
                                ? "Madre"
                                : dependiente.parentesco === "hermano"
                                ? "Hermano/a"
                                : dependiente.parentesco}
                            </TableCell>
                            <TableCell>
                              {dependiente.fechaNacimiento
                                ? format(
                                    new Date(dependiente.fechaNacimiento),
                                    "dd/MM/yyyy",
                                    { locale: es }
                                  )
                                : "N/A"}
                            </TableCell>
                            <TableCell className="capitalize">
                              {dependiente.genero === "masculino"
                                ? "Masculino"
                                : "Femenino"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
