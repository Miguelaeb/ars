import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AutorizarRechazarLoading() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="rounded-md border">
              <div className="p-4 space-y-4">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>

              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  {Array(8)
                    .fill(null)
                    .map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-6 w-48" />
                      </div>
                    ))}
                </div>

                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-24 w-full" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {Array(3)
                    .fill(null)
                    .map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
