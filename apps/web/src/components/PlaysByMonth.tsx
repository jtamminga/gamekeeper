import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { useEffect, useRef } from 'react'
import type { BarChartData } from '@gamekeeper/core'
import { lastDayOfMonth as getLastDayOfMonth } from 'date-fns'


// register bar chart components
Chart.register(BarController, BarElement, CategoryScale, LinearScale)


// types
type Props = {
  data: BarChartData,
  year: number,
  onMonthClick?: (fromDate: Date, toDate: Date, month: string) => void
}


export function PlaysByMonth({ data, year, onMonthClick }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const chart = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: year.toString(),
          data: data.thisYear,
          backgroundColor: 'rgb(82, 100, 255)'
        }]
      },
      options: {
        animation: false,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grace: 2,
            display: false,
            ticks: {
              display: false
            }
          }
        },
        onClick: e => {
          // Get the bar element that was clicked
          // @ts-expect-error not sure why event types don't work :(
          const points = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);

          if (points.length) {
            // Get the dataset and index of the clicked bar
            const point = points[0];
            const monthIndex = point.index
            const firstDayOfMonth = new Date(year, monthIndex)
            const lastDayOfMonth = getLastDayOfMonth(firstDayOfMonth)
            const monthName = chart.data.labels![point.index]
            onMonthClick?.(firstDayOfMonth, lastDayOfMonth, monthName)
          }
        }
      },
      plugins: [ValueTopOfBar]
    })

    return () => chart.destroy()
  }, [ref, data, year])


  return <canvas ref={ref} className="bar-chart" />
}


// plugin to show value on top of bar
const ValueTopOfBar = {
  id: 'valueTopBar',
  // @ts-expect-error don't know the types :)
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart

    // @ts-expect-error don't know the types :)
    chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
      const value = data.datasets[0].data[index] as number

      if (value === 0) {
        return
      }

      ctx.font = 'bold 12px sans-serif'
      ctx.fillStyle = 'rgb(136, 136, 136)'
      ctx.textAlign = 'center'
      ctx.fillText(
        value,
        datapoint.x,
        datapoint.y - 5
      )
    })
  }
}