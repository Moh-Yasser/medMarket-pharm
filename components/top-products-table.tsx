
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const topProducts = [
  { name: "باراسيتامول 500 ملغ", company: "الدوائية", sales: 1250, revenue: 31250 },
  { name: "أموكسيسيلين 250 ملغ", company: "المتحدة للأدوية", sales: 980, revenue: 49000 },
  { name: "إيبوبروفين 400 ملغ", company: "الشرق الأوسط", sales: 875, revenue: 26250 },
  { name: "فيتامين د 1000 وحدة", company: "الصحة الأولى", sales: 720, revenue: 21600 },
  { name: "أسبرين 100 ملغ", company: "الدوائية", sales: 650, revenue: 13000 },
  { name: "أوميبرازول 20 ملغ", company: "المتحدة للأدوية", sales: 540, revenue: 27000 },
  { name: "لوراتادين 10 ملغ", company: "الشرق الأوسط", sales: 480, revenue: 14400 },
  { name: "ميتفورمين 500 ملغ", company: "الصحة الأولى", sales: 420, revenue: 12600 },
  { name: "سيمفاستاتين 20 ملغ", company: "الدوائية", sales: 380, revenue: 15200 },
  { name: "ديكلوفيناك 50 ملغ", company: "المتحدة للأدوية", sales: 340, revenue: 10200 },
]

export function TopProductsTable() {


  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">المنتجات الأكثر مبيعاً</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">المنتجات مرتبة حسب عدد المبيعات</p>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        {/* Table Container with Fixed Height and Independent Scrolling */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-auto max-h-75 sm:max-h-100">
            <table className="w-full min-w-150">
              <thead className="bg-muted sticky top-0 z-10">
                <tr className="border-b">
                    <th >
                  </th>
                  <th className="text-right p-2 sm:p-3 text-xs sm:text-sm font-medium text-muted-foreground">
                    اسم المنتج
                  </th>
                  <th className="text-right p-2 sm:p-3 text-xs sm:text-sm font-medium text-muted-foreground">الشركة</th>
                  <th className="text-right p-2 sm:p-3 text-xs sm:text-sm font-medium text-muted-foreground">
                    عدد المبيعات
                  </th>
                  <th className="text-right p-2 sm:p-3 text-xs sm:text-sm font-medium text-muted-foreground">
                    إجمالي الإيرادات
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                     <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium">{index+1}#</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium">{product.name}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm text-muted-foreground">{product.company}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">{product.sales.toLocaleString()}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium text-primary">
                      {product.revenue.toLocaleString()}ل.س
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
