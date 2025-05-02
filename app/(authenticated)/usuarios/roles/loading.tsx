import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RolesLoading() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-40" />
              </CardTitle>
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>

                <div className="space-y-2 mt-4">
                  <Skeleton className="h-4 w-20" />
                  <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-3">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-40 mt-1" />
                            <Skeleton className="h-5 w-20 mt-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-64" />
              </CardTitle>
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-5 w-40 mt-1" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-40" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="mt-6">
                    <div className="border rounded-md p-4">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mt-1" />

                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="border-t pt-3 mt-3">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 4 }).map((_, j) => (
                              <Skeleton key={j} className="h-6 w-16 rounded-full" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Skeleton className="h-10 w-40" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
