"use client";

import { DialogFooter } from "@/components/ui/dialog";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Afiliado } from "@/lib/types";

export default function RegistrarAfiliadoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    fechaNacimiento: "",
    genero: "",
    nss: "",
    estadoCivil: "",
    nacionalidad: "",
    telefono: "",
    celular: "",
    email: "",
    direccion: "",
    provincia: "",
    municipio: "",
    sector: "",
    codigoPostal: "",
    plan: "",
    tipoAfiliado: "",
    empleador: "",
    fechaAfiliacion: "",
    formaPago: "",
    estado: "activo",
    coberturaDental: false,
    coberturaVision: false,
    coberturaInternacional: false,
    coberturaMedicamentos: false,
    observaciones: "",
  });
  const [dependientes, setDependientes] = useState<any[]>([]);
  const [newDependiente, setNewDependiente] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    fechaNacimiento: "",
    genero: "",
    parentesco: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState<{
    success: boolean;
    message: string;
    afiliado?: any;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [redirectTimer, setRedirectTimer] = useState(3);

  // Redirect countdown effect
  useEffect(() => {
    if (formSubmitted && redirectTimer > 0) {
      const timer = setTimeout(() => {
        setRedirectTimer(redirectTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (formSubmitted && redirectTimer === 0) {
      router.push("/afiliados");
      // Also log to console for debugging
      console.log("Redirecting to affiliates consultation page");
    }
  }, [formSubmitted, redirectTimer, router]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Validar campos obligatorios
    if (!formData.nombres) {
      errors.nombres = "El nombre es obligatorio";
    }

    if (!formData.apellidos) {
      errors.apellidos = "El apellido es obligatorio";
    }

    if (!formData.cedula) {
      errors.cedula = "La cédula es obligatoria";
    } else {
      // Validar formato de cédula dominicana: 000-0000000-0
      const cedulaRegex = /^\d{3}-\d{7}-\d{1}$/;
      if (!cedulaRegex.test(formData.cedula)) {
        errors.cedula = "Formato de cédula inválido (000-0000000-0)";
      }
    }

    if (!formData.fechaNacimiento) {
      errors.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    }

    if (!formData.genero) {
      errors.genero = "El género es obligatorio";
    }

    if (!formData.nss) {
      errors.nss = "El NSS es obligatorio";
    }

    if (!formData.telefono) {
      errors.telefono = "El teléfono es obligatorio";
    }

    if (!formData.direccion) {
      errors.direccion = "La dirección es obligatoria";
    }

    if (!formData.provincia) {
      errors.provincia = "La provincia es obligatoria";
    }

    if (!formData.municipio) {
      errors.municipio = "El municipio es obligatorio";
    }

    if (!formData.plan) {
      errors.plan = "El plan es obligatorio";
    }

    if (!formData.tipoAfiliado) {
      errors.tipoAfiliado = "El tipo de afiliado es obligatorio";
    }

    if (!formData.fechaAfiliacion) {
      errors.fechaAfiliacion = "La fecha de afiliación es obligatoria";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSwitchChange = (id: string, checked: boolean) => {
    setFormData({
      ...formData,
      [id]: checked,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setShowConfirmation(true);
    } else {
      toast({
        title: "Error de validación",
        description: "Por favor, corrija los errores en el formulario",
        variant: "destructive",
      });
    }
  };

  // Function to save affiliate directly to localStorage
  const saveAfiliadoToLocalStorage = (
    afiliado: Omit<Afiliado, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      // Get existing affiliates
      const existingAfiliadosStr = localStorage.getItem("afiliados");
      const existingAfiliados = existingAfiliadosStr
        ? JSON.parse(existingAfiliadosStr)
        : [];

      // Check if affiliate with same cedula already exists
      const existingAfiliado = existingAfiliados.find(
        (a: Afiliado) => a.cedula === afiliado.cedula
      );
      if (existingAfiliado) {
        throw new Error("Ya existe un afiliado con esta cédula");
      }

      // Create new affiliate with ID and timestamps
      const now = new Date().toISOString();
      const newAfiliado: Afiliado = {
        ...afiliado,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };

      // Add to array and save
      existingAfiliados.push(newAfiliado);
      localStorage.setItem("afiliados", JSON.stringify(existingAfiliados));

      console.log("Affiliate saved to localStorage:", newAfiliado);
      console.log("All affiliates after save:", existingAfiliados);

      return newAfiliado;
    } catch (error) {
      console.error("Error saving affiliate to localStorage:", error);
      throw error;
    }
  };

  // Function to save dependents directly to localStorage
  const saveDependientesToLocalStorage = (
    afiliadoId: string,
    dependientes: any[]
  ) => {
    try {
      // Get existing dependents
      const existingDependientesStr = localStorage.getItem("dependientes");
      const existingDependientes = existingDependientesStr
        ? JSON.parse(existingDependientesStr)
        : [];

      // Create new dependents with IDs and timestamps
      const now = new Date().toISOString();
      const newDependientes = dependientes.map((d) => ({
        ...d,
        id: crypto.randomUUID(),
        afiliadoId,
        createdAt: now,
        updatedAt: now,
      }));

      // Add to array and save
      const updatedDependientes = [...existingDependientes, ...newDependientes];
      localStorage.setItem("dependientes", JSON.stringify(updatedDependientes));

      console.log("Dependents saved to localStorage:", newDependientes);

      return newDependientes;
    } catch (error) {
      console.error("Error saving dependents to localStorage:", error);
      throw error;
    }
  };

  const confirmSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!formRef.current) {
        console.error("Form reference is null");
        toast({
          title: "Error al registrar",
          description: "Ha ocurrido un error al procesar el formulario",
          variant: "destructive",
        });
        return;
      }

      const afiliado = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        cedula: formData.cedula,
        fechaNacimiento: formData.fechaNacimiento, // <--- corregido
        genero: formData.genero,
        nss: formData.nss,
        estadoCivil: formData.estadoCivil,
        nacionalidad: formData.nacionalidad,
        telefono: formData.telefono,
        celular: formData.celular,
        email: formData.email,
        direccion: formData.direccion,
        provincia: formData.provincia,
        municipio: formData.municipio,
        sector: formData.sector,
        codigoPostal: formData.codigoPostal,
        plan: formData.plan,
        tipoAfiliado: formData.tipoAfiliado,
        empleador: formData.empleador,
        fechaAfiliacion: formData.fechaAfiliacion,
        formaPago: formData.formaPago,
        estado: formData.estado,
        coberturaDental: formData.coberturaDental,
        coberturaVision: formData.coberturaVision,
        coberturaInternacional: formData.coberturaInternacional,
        coberturaMedicamentos: formData.coberturaMedicamentos,
        observaciones: formData.observaciones,
      };

      const response = await fetch("/api/afiliados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          afiliado,
          dependientes,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al registrar afiliado");
      }

      const result = await response.json();

      setRegistroExitoso({
        success: true,
        message: "Afiliado registrado exitosamente",
        afiliado: result.afiliado,
      });

      setFormSubmitted(true);
      setShowConfirmation(false);

      toast({
        title: "Afiliado registrado",
        description: "El afiliado ha sido registrado exitosamente",
      });

      setRedirectTimer(3);
    } catch (error) {
      console.error("Error al registrar afiliado:", error);
      toast({
        title: "Error al registrar",
        description:
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al registrar el afiliado",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDependiente = () => {
    // Validar que los campos obligatorios estén completos
    if (
      newDependiente.nombre &&
      newDependiente.apellido &&
      newDependiente.parentesco
    ) {
      setDependientes([...dependientes, { ...newDependiente, id: Date.now() }]);
      setNewDependiente({
        nombre: "",
        apellido: "",
        cedula: "",
        fechaNacimiento: "",
        genero: "",
        parentesco: "",
      });
    } else {
      toast({
        title: "Error al agregar dependiente",
        description: "Complete los campos obligatorios",
        variant: "destructive",
      });
    }
  };

  const removeDependiente = (id: number) => {
    setDependientes(dependientes.filter((dep) => dep.id !== id));
  };

  const handleContinue = (currentTab: string) => {
    // Validate the current tab before proceeding
    let isValid = true;
    const errors: { [key: string]: string } = {};

    if (currentTab === "personal") {
      // Validate personal information fields
      if (!formData.nombres) {
        errors.nombres = "El nombre es obligatorio";
        isValid = false;
      }
      if (!formData.apellidos) {
        errors.apellidos = "El apellido es obligatorio";
        isValid = false;
      }
      if (!formData.cedula) {
        errors.cedula = "La cédula es obligatoria";
        isValid = false;
      } else {
        const cedulaRegex = /^\d{3}-\d{7}-\d{1}$/;
        if (!cedulaRegex.test(formData.cedula)) {
          errors.cedula = "Formato de cédula inválido (000-0000000-0)";
          isValid = false;
        }
      }
      if (!formData.fechaNacimiento) {
        errors.fechaNacimiento = "La fecha de nacimiento es obligatoria";
        isValid = false;
      }
      if (!formData.genero) {
        errors.genero = "El género es obligatorio";
        isValid = false;
      }
      if (!formData.nss) {
        errors.nss = "El NSS es obligatorio";
        isValid = false;
      }
    } else if (currentTab === "contacto") {
      // Validate contact information fields
      if (!formData.telefono) {
        errors.telefono = "El teléfono es obligatorio";
        isValid = false;
      }
      if (!formData.direccion) {
        errors.direccion = "La dirección es obligatoria";
        isValid = false;
      }
      if (!formData.provincia) {
        errors.provincia = "La provincia es obligatoria";
        isValid = false;
      }
      if (!formData.municipio) {
        errors.municipio = "El municipio es obligatorio";
        isValid = false;
      }
    } else if (currentTab === "plan") {
      // Validate plan information fields
      if (!formData.plan) {
        errors.plan = "El plan es obligatorio";
        isValid = false;
      }
      if (!formData.tipoAfiliado) {
        errors.tipoAfiliado = "El tipo de afiliado es obligatorio";
        isValid = false;
      }
      if (!formData.fechaAfiliacion) {
        errors.fechaAfiliacion = "La fecha de afiliación es obligatoria";
        isValid = false;
      }
    }

    setValidationErrors(errors);

    if (isValid) {
      // Navigate to the next tab
      if (currentTab === "personal") {
        setActiveTab("contacto");
      } else if (currentTab === "contacto") {
        setActiveTab("plan");
      } else if (currentTab === "plan") {
        setActiveTab("dependientes");
      }
    } else {
      toast({
        title: "Error de validación",
        description: "Por favor, corrija los errores en el formulario",
        variant: "destructive",
      });
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
            Registrar Nuevo Afiliado
          </h1>
        </div>
      </div>

      {formSubmitted ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Registro exitoso</AlertTitle>
          <AlertDescription>
            El nuevo afiliado ha sido registrado correctamente en el sistema.
            <div className="mt-2">
              Redirigiendo a la sección de consulta en {redirectTimer}{" "}
              segundos...
            </div>
            <div className="mt-4">
              <Button asChild>
                <Link href="/afiliados">Ver listado de afiliados</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 max-w-3xl">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="contacto">
                Información de Contacto
              </TabsTrigger>
              <TabsTrigger value="plan">Plan y Cobertura</TabsTrigger>
              <TabsTrigger value="dependientes">
                Dependientes (Opcional)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Datos Personales</CardTitle>
                  <CardDescription>
                    Ingrese la información personal del nuevo afiliado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombres">
                        Nombres <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombres"
                        name="nombres"
                        placeholder="Ingrese los nombres"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        className={
                          validationErrors.nombres ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.nombres && (
                        <p className="text-red-500 text-sm">
                          {validationErrors.nombres}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellidos">
                        Apellidos <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="apellidos"
                        name="apellidos"
                        placeholder="Ingrese los apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        className={
                          validationErrors.apellidos ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.apellidos && (
                        <p className="text-red-500 text-sm">
                          {validationErrors.apellidos}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cedula">
                        Cédula / Pasaporte{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="cedula"
                        name="cedula"
                        placeholder="000-0000000-0"
                        value={formData.cedula}
                        onChange={handleInputChange}
                        className={
                          validationErrors.cedula ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.cedula && (
                        <p className="text-red-500 text-sm">
                          {validationErrors.cedula}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaNacimiento">
                        Fecha de Nacimiento{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        className={
                          validationErrors.fechaNacimiento
                            ? "border-red-500"
                            : ""
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genero">
                        Género <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="genero"
                        value={formData.genero}
                        onValueChange={(value) =>
                          handleSelectChange("genero", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            validationErrors.genero ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Seleccione el género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="femenino">Femenino</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nss">
                        NSS <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nss"
                        name="nss"
                        placeholder="Número de Seguridad Social"
                        value={formData.nss}
                        onChange={handleInputChange}
                        className={validationErrors.nss ? "border-red-500" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estadoCivil">Estado Civil</Label>
                      <Select
                        name="estadoCivil"
                        value={formData.estadoCivil}
                        onValueChange={(value) =>
                          handleSelectChange("estadoCivil", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el estado civil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="soltero">Soltero/a</SelectItem>
                          <SelectItem value="casado">Casado/a</SelectItem>
                          <SelectItem value="divorciado">
                            Divorciado/a
                          </SelectItem>
                          <SelectItem value="viudo">Viudo/a</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nacionalidad">Nacionalidad</Label>
                      <Select
                        name="nacionalidad"
                        value={formData.nacionalidad}
                        onValueChange={(value) =>
                          handleSelectChange("nacionalidad", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la nacionalidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dominicana">Dominicana</SelectItem>
                          <SelectItem value="extranjera">Extranjera</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={() => handleContinue("personal")}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Continuar
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contacto" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                  <CardDescription>
                    Ingrese los datos de contacto del nuevo afiliado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefono">
                        Teléfono <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        placeholder="(000) 000-0000"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className={
                          validationErrors.telefono ? "border-red-500" : ""
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="celular">Celular</Label>
                      <Input
                        id="celular"
                        name="celular"
                        placeholder="(000) 000-0000"
                        value={formData.celular}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="direccion">
                        Dirección <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        placeholder="Ingrese la dirección"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        className={
                          validationErrors.direccion ? "border-red-500" : ""
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provincia">
                        Provincia <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="provincia"
                        value={formData.provincia}
                        onValueChange={(value) =>
                          handleSelectChange("provincia", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            validationErrors.provincia ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Seleccione la provincia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="santo-domingo">
                            Santo Domingo
                          </SelectItem>
                          <SelectItem value="santiago">Santiago</SelectItem>
                          <SelectItem value="la-vega">La Vega</SelectItem>
                          <SelectItem value="puerto-plata">
                            Puerto Plata
                          </SelectItem>
                          <SelectItem value="san-cristobal">
                            San Cristóbal
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="municipio">
                        Municipio <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="municipio"
                        value={formData.municipio}
                        onValueChange={(value) =>
                          handleSelectChange("municipio", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            validationErrors.municipio ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Seleccione el municipio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="distrito-nacional">
                            Distrito Nacional
                          </SelectItem>
                          <SelectItem value="santo-domingo-este">
                            Santo Domingo Este
                          </SelectItem>
                          <SelectItem value="santo-domingo-norte">
                            Santo Domingo Norte
                          </SelectItem>
                          <SelectItem value="santo-domingo-oeste">
                            Santo Domingo Oeste
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sector">Sector</Label>
                      <Input
                        id="sector"
                        name="sector"
                        placeholder="Ingrese el sector"
                        value={formData.sector}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codigoPostal">Código Postal</Label>
                      <Input
                        id="codigoPostal"
                        name="codigoPostal"
                        placeholder="Ingrese el código postal"
                        value={formData.codigoPostal}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={() => handleContinue("contacto")}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Continuar
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="plan" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Plan y Cobertura</CardTitle>
                  <CardDescription>
                    Seleccione el plan y la cobertura para el nuevo afiliado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan">
                        Plan <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="plan"
                        value={formData.plan}
                        onValueChange={(value) =>
                          handleSelectChange("plan", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            validationErrors.plan ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Seleccione el plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basico">Plan Básico</SelectItem>
                          <SelectItem value="estandar">
                            Plan Estándar
                          </SelectItem>
                          <SelectItem value="premium">Plan Premium</SelectItem>
                          <SelectItem value="empresarial">
                            Plan Empresarial
                          </SelectItem>
                          <SelectItem value="senior">Plan Senior</SelectItem>
                          <SelectItem value="familiar">
                            Plan Familiar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipoAfiliado">
                        Tipo de Afiliado <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="tipoAfiliado"
                        value={formData.tipoAfiliado}
                        onValueChange={(value) =>
                          handleSelectChange("tipoAfiliado", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            validationErrors.tipoAfiliado
                              ? "border-red-500"
                              : ""
                          }
                        >
                          <SelectValue placeholder="Seleccione el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="titular">Titular</SelectItem>
                          <SelectItem value="dependiente">
                            Dependiente
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empleador">Empleador</Label>
                      <Input
                        id="empleador"
                        name="empleador"
                        placeholder="Nombre del empleador"
                        value={formData.empleador}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaAfiliacion">
                        Fecha de Afiliación{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fechaAfiliacion"
                        name="fechaAfiliacion"
                        type="date"
                        value={formData.fechaAfiliacion}
                        onChange={handleInputChange}
                        className={
                          validationErrors.fechaAfiliacion
                            ? "border-red-500"
                            : ""
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="formaPago">Forma de Pago</Label>
                      <Select
                        name="formaPago"
                        value={formData.formaPago}
                        onValueChange={(value) =>
                          handleSelectChange("formaPago", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la forma de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nomina">
                            Descuento de Nómina
                          </SelectItem>
                          <SelectItem value="tarjeta">
                            Tarjeta de Crédito/Débito
                          </SelectItem>
                          <SelectItem value="transferencia">
                            Transferencia Bancaria
                          </SelectItem>
                          <SelectItem value="efectivo">Efectivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">
                        Estado <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="estado"
                        value={formData.estado}
                        onValueChange={(value) =>
                          handleSelectChange("estado", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activo">Activo</SelectItem>
                          <SelectItem value="inactivo">Inactivo</SelectItem>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label>Coberturas Adicionales</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="coberturaDental"
                          name="coberturaDental"
                          checked={formData.coberturaDental}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("coberturaDental", checked)
                          }
                        />
                        <Label htmlFor="coberturaDental">
                          Cobertura Dental
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="coberturaVision"
                          name="coberturaVision"
                          checked={formData.coberturaVision}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("coberturaVision", checked)
                          }
                        />
                        <Label htmlFor="coberturaVision">
                          Cobertura de Visión
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="coberturaInternacional"
                          name="coberturaInternacional"
                          checked={formData.coberturaInternacional}
                          onCheckedChange={(checked) =>
                            handleSwitchChange(
                              "coberturaInternacional",
                              checked
                            )
                          }
                        />
                        <Label htmlFor="coberturaInternacional">
                          Cobertura Internacional
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="coberturaMedicamentos"
                          name="coberturaMedicamentos"
                          checked={formData.coberturaMedicamentos}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("coberturaMedicamentos", checked)
                          }
                        />
                        <Label htmlFor="coberturaMedicamentos">
                          Cobertura Extendida de Medicamentos
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                      id="observaciones"
                      name="observaciones"
                      placeholder="Ingrese observaciones adicionales"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={() => handleContinue("plan")}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Continuar
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="dependientes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dependientes</CardTitle>
                  <CardDescription>
                    Agregue los dependientes del nuevo afiliado (opcional)
                  </CardDescription>
                  <div className="mt-2 text-sm text-gray-500">
                    Este paso es opcional. Puede registrar al afiliado sin
                    agregar dependientes y añadirlos posteriormente si es
                    necesario.
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dep-nombre">
                        Nombre <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dep-nombre"
                        placeholder="Nombre del dependiente"
                        value={newDependiente.nombre}
                        onChange={(e) =>
                          setNewDependiente({
                            ...newDependiente,
                            nombre: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dep-apellido">
                        Apellido <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dep-apellido"
                        placeholder="Apellido del dependiente"
                        value={newDependiente.apellido}
                        onChange={(e) =>
                          setNewDependiente({
                            ...newDependiente,
                            apellido: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dep-parentesco">
                        Parentesco <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newDependiente.parentesco}
                        onValueChange={(value) =>
                          setNewDependiente({
                            ...newDependiente,
                            parentesco: value,
                          })
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
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dep-cedula">Cédula / Pasaporte</Label>
                      <Input
                        id="dep-cedula"
                        placeholder="000-0000000-0"
                        value={newDependiente.cedula}
                        onChange={(e) =>
                          setNewDependiente({
                            ...newDependiente,
                            cedula: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dep-fecha-nacimiento">
                        Fecha de Nacimiento
                      </Label>
                      <Input
                        id="dep-fecha-nacimiento"
                        type="date"
                        value={newDependiente.fechaNacimiento}
                        onChange={(e) =>
                          setNewDependiente({
                            ...newDependiente,
                            fechaNacimiento: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dep-genero">Género</Label>
                      <Select
                        value={newDependiente.genero}
                        onValueChange={(value) =>
                          setNewDependiente({
                            ...newDependiente,
                            genero: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="femenino">Femenino</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button type="button" onClick={addDependiente}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Dependiente
                    </Button>
                  </div>

                  {dependientes.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">
                        Dependientes Agregados
                      </h3>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Apellido</TableHead>
                              <TableHead>Parentesco</TableHead>
                              <TableHead>Cédula</TableHead>
                              <TableHead>Fecha Nacimiento</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {dependientes.map((dep) => (
                              <TableRow key={dep.id}>
                                <TableCell>{dep.nombre}</TableCell>
                                <TableCell>{dep.apellido}</TableCell>
                                <TableCell>{dep.parentesco}</TableCell>
                                <TableCell>{dep.cedula || "-"}</TableCell>
                                <TableCell>
                                  {dep.fechaNacimiento || "-"}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeDependiente(dep.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4 mt-4">
                <Button
                  variant="outline"
                  type="button"
                  asChild
                  className="px-8"
                >
                  <Link href="/afiliados">Cancelar</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 px-6"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                  </svg>
                  Registrar Afiliado
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      )}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar registro de nuevo afiliado</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea registrar este nuevo afiliado con la
              información proporcionada?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                console.log("Confirm button clicked");
                confirmSubmit();
              }}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </div>
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
