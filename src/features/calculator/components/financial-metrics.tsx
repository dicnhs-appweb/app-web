import {useTheme} from '@/components/theme-provider'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {formatCurrency} from '@/features/calculator/lib/format-currency'
import {cn} from '@/lib/utils'
import {Accordion} from '@radix-ui/react-accordion'
import {CalculatorIcon, RadicalIcon} from 'lucide-react'
import {metricColors} from '../lib/utils'
import {
  FinancialAnalysisResult,
  ProductPricingModel,
} from '../types/product.model'

interface MetricCardProps {
  title: string
  value: number | string
  information?: React.ReactNode
  calculation: string
  formula: string
  colorClass: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  information,
  calculation,
  formula,
  colorClass,
}) => {
  const {theme} = useTheme()
  const isDarkMode = theme === 'dark' || theme === 'system'

  return (
    <Card className="h-full p-6 space-y-3">
      <div className="flex flex-col gap-2">
        <h3
          className={cn(
            'text-md',
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          )}
        >
          {title}
        </h3>
        <p className={cn('text-3xl font-bold', colorClass)}>
          {title === 'Margin of Safety'
            ? `${value}%`
            : title === 'Break-Even Point'
              ? `${value} units`
              : title === 'Unit Cost' ||
                  title === 'Recommended Price' ||
                  title === 'Contribution Margin'
                ? `${formatCurrency(Number(value))}`
                : title === 'Contribution Margin Ratio'
                  ? `${value}%`
                  : title === 'Operating Leverage'
                    ? `${value}`
                    : `${typeof value === 'number' ? formatCurrency(value) : value}`}
        </p>
      </div>
      <div>
        <div className="mb-2">{information}</div>
        <div className="flex flex-col gap-2">
          <div>
            <p
              className={cn(
                'inline-flex text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              <RadicalIcon className="w-4 h-4 mr-1" />
              <p>Formula</p>
            </p>
            <p className="text-sm">{formula}</p>
          </div>
          <div>
            <p
              className={cn(
                'inline-flex text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              <CalculatorIcon className="w-4 h-4 mr-1" />
              <p>Calculation</p>
            </p>
            <p className="text-sm">{calculation}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface FinancialMetricsDashboardProps {
  result: FinancialAnalysisResult | null
  input: Partial<ProductPricingModel>
}

const FinancialMetrics: React.FC<FinancialMetricsDashboardProps> = ({
  result,
  input,
}) => {
  const {theme} = useTheme()
  const isDarkMode = theme === 'dark' || theme === 'system'

  if (!result) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Computation Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={cn(
              'text-center',
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            )}
          >
            Fill in all required fields to see the computation result.
          </p>
        </CardContent>
      </Card>
    )
  }

  const unitCostTableData = [
    {cost: '₱60.00', quantity: '20 pcs', item: '3 Large Sweet Mangoes'},
    {
      cost: '₱148.00',
      quantity: '1 box (200g)',
      item: 'Frosty Whip Cream Powder',
    },
    {cost: '₱2.00', quantity: '¾ cup', item: 'Water, cold'},
    {
      cost: '₱58.00',
      quantity: '1 pack (250ml)',
      item: 'Nestle All-Purpose Cream',
    },
    {cost: '₱17.50', quantity: '½ (80ml)', item: 'Condensed Milk (small)'},
    {cost: '₱45.50', quantity: '1 pack + 4 pcs', item: 'Honey Graham Crackers'},
    {
      cost: '₱38.50',
      quantity: '8 pcs',
      item: 'Medium Clear View Pastry Containers',
    },
    {cost: '₱5.00', quantity: '—', item: 'Miscellaneous (e.g., Electricity)'},
  ]

  const metricsData = [
    {
      title: 'Unit Cost',
      value: result.unitCost,
      information: (
        <div
          className={cn(
            'mb-2 text-sm space-y-2',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          <p className="leading-relaxed">
            Unit cost represents the total expense required to produce, store,
            and sell one unit of a particular product or service. This includes
            all direct and indirect costs associated with creating and
            delivering the product or service.{' '}
            <a
              href="https://www.investopedia.com/terms/u/unitcost.asp"
              className="underline hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more about unit cost.
            </a>
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-2">
              <AccordionTrigger>Why is it important?</AccordionTrigger>
              <AccordionContent>
                <p className="font-medium">
                  Understanding your unit cost is crucial for:
                </p>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>
                    Pricing your products correctly to maximize profitability.
                  </li>
                  <li>
                    Identifying areas where you can reduce costs to improve
                    margins.
                  </li>
                  <li>
                    Determining if your production process is efficient to
                    enhance productivity.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-1">
              <AccordionTrigger>Example scenario</AccordionTrigger>
              <AccordionContent>
                <div>
                  <p className="leading-relaxed">
                    For example, if you're running a mango float business, your
                    cost breakdown would include:
                  </p>
                  <div>
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableCell className="py-2">Item</TableCell>
                          <TableCell className="py-2">Quantity</TableCell>
                          <TableCell className="py-2">Cost</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {unitCostTableData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell className="py-2">{row.item}</TableCell>
                            <TableCell className="py-2">
                              {row.quantity}
                            </TableCell>
                            <TableCell className="py-2">{row.cost}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2} className="py-2">
                            Total
                          </TableCell>
                          <TableCell className="py-2">₱374.50</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                  <p className="mt-4">
                    Hence, the total cost is ₱374.50 and produced 8 mango
                    floats. So, the unit cost is ₱374.50 / 8 = ₱46.81.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      formula: 'Total Cost / Planned Production Quantity',
      calculation: `${formatCurrency(result.totalCost)} / ${input.plannedProductionQuantity} = ${formatCurrency(result.unitCost)}`,
      colorClass: cn(metricColors.unitCost(result.unitCost)),
    },
    {
      title: 'Recommended Price',
      value: result.recommendedPrice,
      information: (
        <div
          className={cn(
            'mb-2 text-sm space-y-2',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          <p className="leading-relaxed">
            For small businesses and student entrepreneurs, the suggested price
            is a crucial element in your pricing strategy. Unlike large
            manufacturers who might use Manufacturer's Suggested Retail Price
            (MSRP), your suggested price will typically be based on either a
            margin-based approach or a cost-plus method.{' '}
            <a
              href="https://www.investopedia.com/terms/s/suggested-retail-price.asp"
              className="underline hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more about suggested pricing.
            </a>
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Pricing approaches</AccordionTrigger>
              <AccordionContent>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>
                    Margin-based pricing: You decide on a desired profit margin
                    and add this to your unit cost.
                  </li>
                  <li>
                    Cost-plus pricing: You add a fixed amount or percentage to
                    your unit cost.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Example scenario</AccordionTrigger>
              <AccordionContent>
                <p>
                  If you're selling handmade jewelry in Cebu, and your unit cost
                  for a necklace is ₱200:
                </p>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>
                    Cost-plus approach: Add 50% to arrive at a suggested price
                    of ₱300.
                  </li>
                  <li>
                    Margin-based approach: Aim for a 40% profit margin,
                    suggesting a price of ₱333.33 (rounded to ₱335).
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Factors to consider</AccordionTrigger>
              <AccordionContent>
                <p>Your suggested price should consider:</p>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>Your costs</li>
                  <li>Market demand</li>
                  <li>Competitor pricing</li>
                  <li>Your brand positioning</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      formula:
        input.pricingStrategy?.method === 'cost-plus'
          ? 'Unit Cost * (1 + Target Value / 100)'
          : 'Unit Cost + Target Value',
      calculation:
        input.pricingStrategy?.method === 'cost-plus' &&
        input.pricingStrategy.targetValue !== undefined
          ? `${formatCurrency(result.unitCost)} * (1 + ${input.pricingStrategy.targetValue} / 100) = ${formatCurrency(result.recommendedPrice)}`
          : `${formatCurrency(result.unitCost)} + ${formatCurrency(input.pricingStrategy?.targetValue ?? 0)} = ${formatCurrency(result.recommendedPrice)}`,
      colorClass: cn(
        metricColors.recommendedPrice(result.recommendedPrice, result.unitCost)
      ),
    },
    {
      title: 'Break-Even Point',
      value: result.breakEvenPoint,
      information: (
        <div
          className={cn(
            'mb-2 text-sm space-y-2',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          <p className="leading-relaxed">
            For small businesses in the Philippines, the break-even point is
            crucial to understand. It's the point at which your total costs and
            total revenue are equal, meaning you're not making a profit, but
            you're not losing money either.{' '}
            <a
              href="https://www.investopedia.com/terms/b/breakevenpoint.asp"
              className="underline hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more about break-even point.
            </a>
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-2">
              <AccordionTrigger>Example scenario</AccordionTrigger>
              <AccordionContent>
                <p>
                  Let's say you're running a small T-shirt printing business in
                  Davao:
                </p>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>Monthly fixed costs (rent, equipment lease): ₱20,000</li>
                  <li>T-shirt selling price: ₱250 each</li>
                  <li>T-shirt production cost: ₱100 each (variable cost)</li>
                </ul>
                <p className="mt-2">
                  Break-even calculation: 20,000 / (250 - 100) = 133.33
                </p>
                <p>
                  This means you need to sell 134 T-shirts per month to break
                  even.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Why it's important</AccordionTrigger>
              <AccordionContent>
                <p>Understanding your break-even point helps you:</p>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>Set sales targets</li>
                  <li>Make decisions about expenses</li>
                  <li>Determine if your business idea is viable</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      formula: 'Fixed Costs / (Sales Price per Unit – Variable Cost Per Unit)',
      calculation: `Calculated based on cost structure and recommended price`,
      colorClass: cn(
        metricColors.breakEvenPoint(
          result.breakEvenPoint,
          input.forecastedSalesQuantity || 0
        )
      ),
    },
    {
      title: 'Contribution Margin',
      value: result.contributionMargin,
      information: (
        <div
          className={cn(
            'mb-2 text-sm space-y-2',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          <p className="leading-relaxed">
            For small and medium enterprises in the Philippines, the
            contribution margin is a crucial metric that shows how much of your
            sales revenue is available to cover fixed costs and contribute to
            profits after accounting for variable costs.{' '}
            <a
              href="https://www.investopedia.com/terms/c/contributionmargin.asp"
              className="underline hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more about contribution margin.
            </a>
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Contribution margin formula</AccordionTrigger>
              <AccordionContent>
                <p>Contribution Margin = Revenue - Variable Costs</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Example scenario</AccordionTrigger>
              <AccordionContent>
                <p>If you're running a small coffee shop in Baguio:</p>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>You sell a cup of coffee for ₱100 (Revenue)</li>
                  <li>The variable costs (coffee beans, milk, cup) are ₱40</li>
                </ul>
                <p className="mt-2">
                  Your contribution margin would be ₱60 per cup.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Why it's important</AccordionTrigger>
              <AccordionContent>
                <p>Understanding your contribution margin can help you:</p>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>Decide which products to focus on</li>
                  <li>Set prices</li>
                  <li>
                    Understand how changes in sales will affect your profit
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      formula: 'Price - Variable Cost per Unit',
      calculation: `${formatCurrency(result.recommendedPrice)} - Variable Cost = ${formatCurrency(result.contributionMargin)}`,
      colorClass: cn(
        metricColors.contributionMargin(
          result.contributionMargin,
          result.recommendedPrice
        )
      ),
    },
    {
      title: 'Contribution Margin Ratio',
      value: result.contributionMarginRatio * 100,
      information: (
        <div
          className={cn(
            'mb-2 text-sm space-y-2',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          <p className="leading-relaxed">
            For small businesses and entrepreneurs in the Philippines, the
            Contribution Margin Ratio (CM Ratio) is a percentage that shows how
            much of each peso of revenue is available to cover fixed costs and
            contribute to profit.{' '}
            <a
              href="https://corporatefinanceinstitute.com/resources/accounting/contribution-margin-ratio-formula/"
              className="underline hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more about contribution margin ratio.
            </a>
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>CM Ratio formula</AccordionTrigger>
              <AccordionContent>
                <p>
                  CM Ratio = (Total Revenue - Total Variable Costs) / Total
                  Revenue
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Example scenario</AccordionTrigger>
              <AccordionContent>
                <p>
                  Let's say you're running a small online business selling
                  handmade bags:
                </p>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>Your monthly revenue is ₱100,000</li>
                  <li>Your variable costs (materials, shipping) are ₱60,000</li>
                </ul>
                <p className="mt-2">
                  Your CM Ratio would be: (100,000 - 60,000) / 100,000 = 0.4 or
                  40%
                </p>
                <p>
                  This means that for every peso of sales, 40 centavos are
                  available to cover fixed costs and contribute to profit.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Why it's important</AccordionTrigger>
              <AccordionContent>
                <p>The CM Ratio is useful for:</p>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>Comparing the profitability of different products</li>
                  <li>Making pricing decisions</li>
                  <li>Planning for growth and expansion</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      formula: '(Contribution Margin / Price) * 100',
      calculation: `(${formatCurrency(result.contributionMargin)} / ${formatCurrency(result.recommendedPrice)}) * 100 = ${(result.contributionMarginRatio * 100).toFixed(2)}%`,
      colorClass: cn(
        metricColors.contributionMarginRatio(result.contributionMarginRatio)
      ),
    },
    {
      title: 'Operating Leverage',
      value: result.operatingLeverage,
      information: (
        <div
          className={cn(
            'mb-2 text-sm space-y-2',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          <p className="leading-relaxed">
            For small and medium enterprises in the Philippines, Operating
            Leverage is a measure of how changes in sales affect your operating
            income. It's particularly important for businesses with high fixed
            costs.{' '}
            <a
              href="https://www.investopedia.com/terms/o/operatingleverage.asp"
              className="underline hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more about operating leverage.
            </a>
          </p>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Operating Leverage formula</AccordionTrigger>
              <AccordionContent>
                <p>
                  Degree of Operating Leverage (DOL) = Contribution Margin /
                  Profit
                </p>
                <p>or</p>
                <p>DOL = (Q * CM) / (Q * CM - Fixed operating costs)</p>
                <p>
                  Where: Q = unit quantity, CM = contribution margin (price -
                  variable cost per unit)
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Example scenario</AccordionTrigger>
              <AccordionContent>
                <p>
                  If you're running a small manufacturing business in Pampanga:
                </p>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>
                    You sell 1,000 units at ₱500 each (Revenue = ₱500,000)
                  </li>
                  <li>
                    Variable costs are ₱300 per unit (Total variable costs =
                    ₱300,000)
                  </li>
                  <li>Fixed costs are ₱150,000</li>
                </ul>
                <p className="mt-2">
                  Your DOL would be: (500,000 - 300,000) / (500,000 - 300,000 -
                  150,000) = 4
                </p>
                <p>
                  This means that a 1% increase in sales would result in a 4%
                  increase in operating income.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Why it's important</AccordionTrigger>
              <AccordionContent>
                <p>Understanding your operating leverage can help you:</p>
                <ul className="mt-2 ml-4 text-sm list-disc list-inside">
                  <li>Assess business risk</li>
                  <li>Make decisions about fixed vs. variable costs</li>
                  <li>Plan for growth and expansion</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
      formula: 'Contribution Margin / Operating Income',
      calculation: `Calculated based on contribution margin and operating income`,
      colorClass: cn(metricColors.operatingLeverage(result.operatingLeverage)),
    },
  ]
  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {metricsData.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  )
}

FinancialMetrics.displayName = 'FinancialMetrics'

export default FinancialMetrics
