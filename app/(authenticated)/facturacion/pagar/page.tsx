"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, CreditCard, DollarSign, Search, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Esquema de validación para el formulario de búsqueda
const searchSchema = z.object({
  searchType: z.enum(["proveedor", "factura"]),
  searchTerm: z.string().min(1, "Este campo es requerido"),
})

// Esquema de validación para el formulario de pago
const paymentSchema = z.object({
  paymentMethod: z.enum(["transferencia", "cheque", "efectivo"]),
  bankAccount: z.string().optional(),
  referenceNumber: z.string().min(1, "Número de referencia es requerido"),
  paymentDate: z.date({
    required_error: "Fecha de pago es requerida",
  }),
  notes: z.string().optional(),
})

// Datos de ejemplo para facturas pendientes
const mockInvoices = [
  {
    id: "F-2023-001",
    provider: "Hospital Central Dominicano",
    amount: 45780.5,
    date: "2023-10-15",
    dueDate: "2023-11-15",
    status: "pendiente",
    services: "Servicios médicos varios",
  },
  {
    id: "F-2023-002",
    provider: "Clínica Especializada del Este",
    amount: 32450.75,
    date: "2023-10-18",
    dueDate: "2023-11-18",
    status: "pendiente",
    services: "Consultas y procedimientos",
  },
  {
    id: "F-2023-003",
    provider: "Laboratorio Médico Nacional",
    amount: 12890.25,
    date: "2023-10-20",
    dueDate: "2023-11-20",
    status: "pendiente",
    services: "Análisis clínicos",
  },
  {
    id: "F-2023-004",
    provider: "Centro de Diagnóstico Avanzado",
    amount: 28750.0,
    date: "2023-10-22",
    dueDate: "2023-11-22",
    status: "pendiente",
    services: "Estudios de imagen",
  },
  {
    id: "F-2023-005",
    provider: "Hospital Central Dominicano",
    amount: 18920.3,
    date: "2023-10-25",
    dueDate: "2023-11-25",
    status: "pendiente",
    services: "Procedimientos quirúrgicos",
  },
]

export default function GenerarPagoPage() {
  const [searchResults, setSearchResults] = useState<typeof mockInvoices>([])
  const [selectedInvoices, setSelectedInvoices] = useState<typeof mockInvoices>([])
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)

  // Formulario de búsqueda
  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchType: "proveedor",
      searchTerm: "",
    },
  })

  // Formulario de pago
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "transferencia",
      paymentDate: new Date(),
    },
  })

  // Función para buscar facturas
  const onSearchSubmit = (data: z.infer<typeof searchSchema>) => {
    // En un caso real, aquí se haría una llamada a la API
    // Por ahora, simulamos una búsqueda con los datos de ejemplo
    let results = []

    if (data.searchType === "proveedor") {
      results = mockInvoices.filter((invoice) => invoice.provider.toLowerCase().includes(data.searchTerm.toLowerCase()))
    } else {
      results = mockInvoices.filter((invoice) => invoice.id.toLowerCase().includes(data.searchTerm.toLowerCase()))
    }

    setSearchResults(results)
  }

  // Función para seleccionar/deseleccionar una factura
  const toggleInvoiceSelection = (invoice: (typeof mockInvoices)[0]) => {
    const isSelected = selectedInvoices.some((inv) => inv.id === invoice.id)

    if (isSelected) {
      setSelectedInvoices(selectedInvoices.filter((inv) => inv.id !== invoice.id))
    } else {
      setSelectedInvoices([...selectedInvoices, invoice])
    }
  }

  // Actualizar el monto total cuando cambian las facturas seleccionadas
  useState(() => {
    const total = selectedInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
    setTotalAmount(total)
  })

  // Función para proceder al formulario de pago
  const proceedToPayment = () => {
    if (selectedInvoices.length === 0) return

    const total = selectedInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
    setTotalAmount(total)
    setShowPaymentForm(true)
  }

  // Función para procesar el pago
  const onPaymentSubmit = (data: z.infer<typeof paymentSchema>) => {
    // En un caso real, aquí se enviarían los datos a la API
    console.log("Datos de pago:", data)
    console.log("Facturas seleccionadas:", selectedInvoices)

    // Mostrar diálogo de confirmación
    setShowConfirmation(true)
  }

  // Función para confirmar el pago
  const confirmPayment = () => {
    // En un caso real, aquí se confirmaría el pago en la API
    setShowConfirmation(false)
    setPaymentSuccess(true)

    // Reiniciar el formulario después de un tiempo
    setTimeout(() => {
      setPaymentSuccess(false)
      setShowPaymentForm(false)
      setSelectedInvoices([])
      setSearchResults([])
      searchForm.reset()
      paymentForm.reset()
    }, 3000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Generar Pago</h1>
      </div>

      {paymentSuccess && (
        <Alert className="bg-green-50 border-green-500">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Pago procesado con éxito</AlertTitle>
          <AlertDescription className="text-green-700">
            El pago ha sido registrado correctamente en el sistema.
          </AlertDescription>
        </Alert>
      )}

      {!showPaymentForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Buscar Facturas Pendientes</CardTitle>
            <CardDescription>Busque facturas pendientes por proveedor o número de factura</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...searchForm}>
              <form onSubmit={searchForm.handleSubmit(onSearchSubmit)} className="space-y-4">
                <FormField
                  control={searchForm.control}
                  name="searchType"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Buscar por</FormLabel>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="proveedor" />
                          </FormControl>
                          <FormLabel className="font-normal">Proveedor</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="factura" />
                          </FormControl>
                          <FormLabel className="font-normal">Número de Factura</FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={searchForm.control}
                  name="searchTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Término de búsqueda</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Ingrese su búsqueda" {...field} />
                          <Button type="submit" size="icon" className="absolute right-0 top-0">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {searchResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Resultados de la búsqueda</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>No. Factura</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Vencimiento</TableHead>
                        <TableHead className="text-right">Monto (RD$)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedInvoices.some((inv) => inv.id === invoice.id)}
                              onCheckedChange={() => toggleInvoiceSelection(invoice)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.provider}</TableCell>
                          <TableCell>{format(new Date(invoice.date), "dd/MM/yyyy")}</TableCell>
                          <TableCell>{format(new Date(invoice.dueDate), "dd/MM/yyyy")}</TableCell>
                          <TableCell className="text-right">
                            {invoice.amount.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{selectedInvoices.length} facturas seleccionadas</p>
                    <p className="font-medium">
                      Total a pagar: RD${" "}
                      {selectedInvoices
                        .reduce((sum, invoice) => sum + invoice.amount, 0)
                        .toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Button
                    onClick={proceedToPayment}
                    disabled={selectedInvoices.length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Proceder al Pago
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Pago</CardTitle>
            <CardDescription>
              Complete la información para procesar el pago de {selectedInvoices.length} facturas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Resumen de Facturas</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Factura</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead className="text-right">Monto (RD$)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.provider}</TableCell>
                        <TableCell>{invoice.services}</TableCell>
                        <TableCell className="text-right">
                          {invoice.amount.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-bold text-right">
                        Total a Pagar:
                      </TableCell>
                      <TableCell className="font-bold text-right">
                        RD$ {totalAmount.toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator className="my-6" />

            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                <FormField
                  control={paymentForm.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Método de Pago</FormLabel>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="transferencia" />
                          </FormControl>
                          <FormLabel className="font-normal">Transferencia Bancaria</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="cheque" />
                          </FormControl>
                          <FormLabel className="font-normal">Cheque</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="efectivo" />
                          </FormControl>
                          <FormLabel className="font-normal">Efectivo</FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {paymentForm.watch("paymentMethod") === "transferencia" && (
                  <FormField
                    control={paymentForm.control}
                    name="bankAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuenta Bancaria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una cuenta" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cuenta1">Banco Popular - Cuenta Corriente</SelectItem>
                            <SelectItem value="cuenta2">Banreservas - Cuenta Corporativa</SelectItem>
                            <SelectItem value="cuenta3">BHD León - Cuenta de Ahorros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={paymentForm.control}
                  name="referenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Referencia</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el número de referencia del pago" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número de transferencia, cheque o recibo según el método de pago
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={paymentForm.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Pago</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Seleccione una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("2023-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={paymentForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas Adicionales</FormLabel>
                      <FormControl>
                        <Input placeholder="Observaciones o comentarios sobre el pago (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowPaymentForm(false)}>
                    Volver
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Procesar Pago
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de confirmación */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Pago</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea procesar este pago por un total de RD${" "}
              {totalAmount.toLocaleString("es-DO", { minimumFractionDigits: 2 })}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Esta acción no se puede deshacer. Se registrará el pago para {selectedInvoices.length} facturas.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={confirmPayment} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmar Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
