import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { useEffect, useRef } from 'react'
import type { BarChartData } from '@gamekeeper/core'


// register bar chart components
Chart.register(BarController, BarElement, CategoryScale, LinearScale)


// types
type Props = {
  data: BarChartData
}


export function PlaysByMonth({ data }: Props) {
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
          label: 'this year',
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
      },
      plugins: [ValueTopOfBar]
    })

    return () => chart.destroy()
  }, [ref, data])


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