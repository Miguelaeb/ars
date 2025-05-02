import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function LoadingInvoiceStatusPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[300px]" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-[250px] mb-2" />
          <Skeleton className="h-5 w-[350px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
