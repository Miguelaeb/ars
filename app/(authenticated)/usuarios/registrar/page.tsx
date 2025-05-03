"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useAuth, type UserRole } from "@/contexts/auth-context";
import { addUser } from "@/lib/db-service";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    email: z.string().email({ message: "Correo electrónico inválido" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z.string(),
    role: z.enum([
      "admin",
      "doctor",
      "billing",
      "afiliaciones",
      "autorizaciones",
      "supervisor",
      "consulta",
    ] as const),
    department: z.string().min(2, { message: "El departamento es requerido" }),
    position: z.string().min(2, { message: "El cargo es requerido" }),
    status: z.enum(["active", "inactive", "blocked"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

// Predefined lists for departments and positions
const departments = [
  { value: "afiliaciones", label: "Afiliaciones" },
  { value: "autorizaciones", label: "Autorizaciones" },
  { value: "facturacion", label: "Facturación" },
  { value: "prestadores", label: "Prestadores" },
  { value: "sistemas", label: "Sistemas" },
  { value: "administracion", label: "Administración" },
  { value: "direccion", label: "Dirección" },
  { value: "auditoria", label: "Auditoría Médica" },
  { value: "servicio_cliente", label: "Servicio al Cliente" },
  { value: "recursos_humanos", label: "Recursos Humanos" },
  { value: "finanzas", label: "Finanzas" },
  { value: "legal", label: "Legal" },
];

// Positions organized by department
const positionsByDepartment: Record<
  string,
  { value: string; label: string }[]
> = {
  afiliaciones: [
    { value: "coordinador_afiliaciones", label: "Coordinador de Afiliaciones" },
    { value: "analista_afiliaciones", label: "Analista de Afiliaciones" },
    { value: "asistente_afiliaciones", label: "Asistente de Afiliaciones" },
    { value: "supervisor_afiliaciones", label: "Supervisor de Afiliaciones" },
  ],
  autorizaciones: [
    {
      value: "coordinador_autorizaciones",
      label: "Coordinador de Autorizaciones",
    },
    { value: "analista_autorizaciones", label: "Analista de Autorizaciones" },
    { value: "medico_auditor", label: "Médico Auditor" },
    {
      value: "supervisor_autorizaciones",
      label: "Supervisor de Autorizaciones",
    },
  ],
  facturacion: [
    { value: "coordinador_facturacion", label: "Coordinador de Facturación" },
    { value: "analista_facturacion", label: "Analista de Facturación" },
    { value: "asistente_facturacion", label: "Asistente de Facturación" },
    { value: "supervisor_facturacion", label: "Supervisor de Facturación" },
  ],
  prestadores: [
    { value: "coordinador_prestadores", label: "Coordinador de Prestadores" },
    { value: "analista_prestadores", label: "Analista de Prestadores" },
    { value: "gestor_contratos", label: "Gestor de Contratos" },
    { value: "supervisor_prestadores", label: "Supervisor de Prestadores" },
  ],
  sistemas: [
    { value: "director_ti", label: "Director de TI" },
    { value: "administrador_sistemas", label: "Administrador de Sistemas" },
    { value: "desarrollador", label: "Desarrollador" },
    { value: "soporte_tecnico", label: "Soporte Técnico" },
    { value: "analista_seguridad", label: "Analista de Seguridad" },
  ],
  administracion: [
    { value: "director_administrativo", label: "Director Administrativo" },
    { value: "gerente_administrativo", label: "Gerente Administrativo" },
    { value: "asistente_administrativo", label: "Asistente Administrativo" },
    {
      value: "coordinador_administrativo",
      label: "Coordinador Administrativo",
    },
  ],
  direccion: [
    { value: "director_general", label: "Director General" },
    { value: "director_operaciones", label: "Director de Operaciones" },
    { value: "director_medico", label: "Director Médico" },
    { value: "asistente_direccion", label: "Asistente de Dirección" },
  ],
  auditoria: [
    { value: "director_auditoria", label: "Director de Auditoría Médica" },
    { value: "auditor_medico_senior", label: "Auditor Médico Senior" },
    { value: "auditor_medico", label: "Auditor Médico" },
    { value: "asistente_auditoria", label: "Asistente de Auditoría" },
  ],
  servicio_cliente: [
    {
      value: "coordinador_servicio",
      label: "Coordinador de Servicio al Cliente",
    },
    {
      value: "representante_servicio",
      label: "Representante de Servicio al Cliente",
    },
    {
      value: "supervisor_servicio",
      label: "Supervisor de Servicio al Cliente",
    },
  ],
  recursos_humanos: [
    { value: "director_rrhh", label: "Director de Recursos Humanos" },
    { value: "analista_rrhh", label: "Analista de Recursos Humanos" },
    {
      value: "especialista_reclutamiento",
      label: "Especialista en Reclutamiento",
    },
    { value: "asistente_rrhh", label: "Asistente de Recursos Humanos" },
  ],
  finanzas: [
    { value: "director_financiero", label: "Director Financiero" },
    { value: "contador", label: "Contador" },
    { value: "analista_financiero", label: "Analista Financiero" },
    { value: "tesorero", label: "Tesorero" },
  ],
  legal: [
    { value: "asesor_legal", label: "Asesor Legal" },
    { value: "abogado", label: "Abogado" },
    { value: "asistente_legal", label: "Asistente Legal" },
  ],
  // Default positions for any department
  default: [
    { value: "director", label: "Director" },
    { value: "coordinador", label: "Coordinador" },
    { value: "analista", label: "Analista" },
    { value: "asistente", label: "Asistente" },
    { value: "supervisor", label: "Supervisor" },
  ],
};

const roleDescriptions: Record<UserRole, string> = {
  admin: "Acceso completo a todas las funciones del sistema",
  doctor: "Acceso a autorizaciones médicas y consulta de afiliados",
  billing: "Acceso a facturación, pagos y reportes financieros",
  afiliaciones: "Gestión de afiliados y planes",
  autorizaciones: "Gestión de autorizaciones médicas",
  supervisor: "Supervisión de operaciones y reportes",
  consulta: "Acceso de solo lectura a información básica",
};

export default function RegistrarUsuarioPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [availablePositions, setAvailablePositions] = useState<
    { value: string; label: string }[]
  >(positionsByDepartment.default);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "consulta",
      department: "",
      position: "",
      status: "active",
    },
  });

  // Update available positions when department changes
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    form.setValue("department", value);

    // Reset position when department changes
    form.setValue("position", "");

    // Update available positions based on selected department
    setAvailablePositions(
      positionsByDepartment[value] || positionsByDepartment.default
    );
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await fetch("/api/usuarios/registrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          department: data.department,
          position: data.position,
          status: data.status,
        }),
      });

      setSuccess(true);
      toast({
        title: "Usuario registrado",
        description: "El usuario ha sido registrado exitosamente",
      });

      // Reset form after successful submission
      form.reset();

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/usuarios");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al registrar usuario"
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error ? err.message : "Error al registrar usuario",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user has permission to create users
  if (!hasPermission("usuarios", "create")) {
    return (
      <div className="flex flex-col gap-5">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso denegado</AlertTitle>
          <AlertDescription>
            No tiene permisos para registrar usuarios. Contacte al administrador
            del sistema.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold text-gray-800">Registrar Usuario</h1>

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Usuario registrado exitosamente</AlertTitle>
          <AlertDescription>
            El usuario ha sido registrado en el sistema. Redirigiendo...
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
          <CardDescription>Ingrese los datos del nuevo usuario</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  placeholder="Nombre completo"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@vidasalud.com.do"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select onValueChange={handleDepartmentChange}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Seleccione un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.department && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.department.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Select
                  onValueChange={(value) => form.setValue("position", value)}
                  disabled={!selectedDepartment}
                >
                  <SelectTrigger id="position">
                    <SelectValue
                      placeholder={
                        selectedDepartment
                          ? "Seleccione un cargo"
                          : "Primero seleccione un departamento"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePositions.map((pos) => (
                      <SelectItem key={pos.value} value={pos.value}>
                        {pos.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.position && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.position.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    {...form.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar contraseña"
                    {...form.register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <RadioGroup
                defaultValue="active"
                className="flex space-x-4"
                onValueChange={(value) =>
                  form.setValue(
                    "status",
                    value as "active" | "inactive" | "blocked"
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active" className="cursor-pointer">
                    Activo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="inactive" />
                  <Label htmlFor="inactive" className="cursor-pointer">
                    Inactivo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blocked" id="blocked" />
                  <Label htmlFor="blocked" className="cursor-pointer">
                    Bloqueado
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                defaultValue="consulta"
                onValueChange={(value) =>
                  form.setValue("role", value as UserRole)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="billing">Facturación</SelectItem>
                  <SelectItem value="afiliaciones">Afiliaciones</SelectItem>
                  <SelectItem value="autorizaciones">Autorizaciones</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="consulta">Consulta</SelectItem>
                </SelectContent>
              </Select>
              {form.watch("role") && (
                <p className="text-sm text-gray-500 mt-1">
                  {roleDescriptions[form.watch("role") as UserRole]}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar Usuario"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
