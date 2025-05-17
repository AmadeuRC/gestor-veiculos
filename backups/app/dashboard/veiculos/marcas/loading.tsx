import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <Card className="border-blue-200 shadow-md">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-64 bg-blue-100" />
              <Skeleton className="h-4 w-80 mt-2 bg-blue-100" />
            </div>
            <Skeleton className="h-10 w-32 bg-blue-100" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Skeleton className="h-5 w-5 mr-2 bg-blue-100" />
            <Skeleton className="h-10 w-64 bg-blue-100" />
          </div>

          <div className="border rounded-md border-blue-200">
            <div className="bg-blue-50 p-3 border-b border-blue-200">
              <div className="grid grid-cols-5 gap-4">
                <Skeleton className="h-6 w-full bg-blue-100" />
                <Skeleton className="h-6 w-full bg-blue-100" />
                <Skeleton className="h-6 w-full bg-blue-100" />
                <Skeleton className="h-6 w-full bg-blue-100" />
                <Skeleton className="h-6 w-20 ml-auto bg-blue-100" />
              </div>
            </div>

            {Array(5)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="p-4 border-b border-blue-100">
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-5 w-full bg-blue-50" />
                    <Skeleton className="h-5 w-full bg-blue-50" />
                    <Skeleton className="h-5 w-full bg-blue-50" />
                    <Skeleton className="h-5 w-full bg-blue-50" />
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md bg-blue-50" />
                      <Skeleton className="h-8 w-8 rounded-md bg-blue-50" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
