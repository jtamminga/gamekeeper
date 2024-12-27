// import puppeteer from 'puppeteer'

// export async function dashboardImage(): Promise<Buffer> {
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()

//   await page.goto('http://192.168.0.100:3001')
//   await page.waitForSelector('h1')
//   await page.setViewport({ width: 600, height: 400 })
//   const buffer = await page.screenshot({
//     encoding: 'binary',
//     type: 'png'
//   })

//   return buffer
// }