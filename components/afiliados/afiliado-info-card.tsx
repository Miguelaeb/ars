import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Afiliado } from "@/lib/types"

interface AfiliadoInfoCardProps {
  afiliado: Afiliado
}

export function AfiliadoInfoCard({ afiliado }: AfiliadoInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>Datos personales del afiliado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
              <p className="text-base">
                {afiliado.nombres} {afiliado.apellidos}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cédula</p>
              <p className="text-base">{afiliado.cedula}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Nacimiento</p>
              <p className="text-base">{afiliado.fechaNacimiento}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Género</p>
              <p className="text-base capitalize">{afiliado.genero}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">NSS</p>
              <p className="text-base">{afiliado.nss}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estado Civil</p>
              <p className="text-base capitalize">{afiliado.estadoCivil}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nacionalidad</p>
              <p className="text-base">{afiliado.nacionalidad}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Empleador</p>
              <p className="text-base">{afiliado.empleador || "No especificado"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Contacto</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-base">{afiliado.telefono}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Celular</p>
                <p className="text-base">{afiliado.celular}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{afiliado.email}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Dirección</p>
            <p className="text-base">{afiliado.direccion}</p>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Provincia</p>
                <p className="text-base">{afiliado.provincia}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Municipio</p>
                <p className="text-base">{afiliado.municipio}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sector</p>
                <p className="text-base">{afiliado.sector}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
