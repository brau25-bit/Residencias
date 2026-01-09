// src/modules/analytics/pdf/pdfGenerator.js

import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class PDFGenerator {
    
    static async generateFullReport(analyticsData) {
        try {
            // Generar imágenes de gráficas
            const charts = await this.generateCharts(analyticsData)

            // Leer el template HTML
            const templatePath = path.join(__dirname, 'templates', 'fullReport.html')
            let html = fs.readFileSync(templatePath, 'utf-8')

            // Leer estilos CSS
            const stylesPath = path.join(__dirname, 'templates', 'styles.css')
            const styles = fs.readFileSync(stylesPath, 'utf-8')

            // Reemplazar placeholders con datos reales y gráficas
            html = this.injectData(html, analyticsData, styles, charts)

            // Generar PDF con Puppeteer
            const browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            })

            const page = await browser.newPage()
            await page.setContent(html, { waitUntil: 'networkidle0' })

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20mm',
                    right: '15mm',
                    bottom: '20mm',
                    left: '15mm'
                }
            })

            await browser.close()

            return pdfBuffer
        } catch (error) {
            console.error('Error generating PDF:', error)
            throw error
        }
    }

    static async generateCharts(data) {
        const width = 800
        const height = 400
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height })

        const charts = {}

        /*
        console.log('📊 Generando gráficas...')

        console.log('reportsByStatus:', data.reportsByStatus ? '✅' : '❌')
        console.log('reportsByCategory:', data.reportsByCategory ? '✅' : '❌')
        console.log('reportsOverTime:', data.reportsOverTime ? '✅' : '❌')
        console.log('timePerStatus:', data.timePerStatus ? '✅' : '❌')
        console.log('statusTransitions:', data.statusTransitions ? '✅' : '❌')
        */

        // 1. Gráfica de barras: Reportes por estado
        charts.reportsByStatus = await this.createBarChart(
            chartJSNodeCanvas,
            data.reportsByStatus.data,
            'Distribución de Reportes por Estado'
        )

        // 2. Gráfica de barras: Reportes por categoría
        charts.reportsByCategory = await this.createBarChart(
            chartJSNodeCanvas,
            data.reportsByCategory.data,
            'Distribución de Reportes por Categoría'
        )

        // 3. Gráfica de líneas: Reportes a lo largo del tiempo
        charts.reportsOverTime = await this.createLineChart(
            chartJSNodeCanvas,
            data.reportsOverTime.data
        )

        // 4. Gráfica de barras horizontales: Tiempo por estado
        charts.timePerStatus = await this.createTimePerStatusChart(
            chartJSNodeCanvas,
            data.timePerStatus
        )

        // 5. Gráfica de barras horizontales: Transiciones
        charts.statusTransitions = await this.createHorizontalBarChart(
            chartJSNodeCanvas,
            data.statusTransitions.data.transitions
        )

        console.log('✅ Gráficas generadas')

        return charts
    }

    static async createBarChart(canvas, chartData, title) {
        const labels = Object.keys(chartData).map(s => this.translateStatusOrCategory(s))
        const values = Object.values(chartData)

        const configuration = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cantidad',
                    data: values,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(168, 85, 247, 0.8)'
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(251, 191, 36)',
                        'rgb(34, 197, 94)',
                        'rgb(239, 68, 68)',
                        'rgb(168, 85, 247)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: title,
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10
                        }
                    }
                }
            }
        }

        const buffer = await canvas.renderToBuffer(configuration)
        return `data:image/png;base64,${buffer.toString('base64')}`
    }

    static async createLineChart(canvas, timeData) {
        const labels = timeData.map(item => item.date)
        const values = timeData.map(item => item.count)

        const configuration = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Reportes Creados',
                    data: values,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgb(59, 130, 246)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Reportes a lo Largo del Tiempo',
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 5
                        }
                    }
                }
            }
        }

        const buffer = await canvas.renderToBuffer(configuration)
        return `data:image/png;base64,${buffer.toString('base64')}`
    }

    static async createTimePerStatusChart(canvas, timeData) {
        const labels = []
        const values = []

        Object.entries(timeData).forEach(([status, data]) => {
            if (status !== 'COMPLETED' && status !== 'CANCELLED') {
                labels.push(this.translateStatus(status))
                values.push(data.averageTimeInHours)
            }
        })

        const configuration = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Horas Promedio',
                    data: values,
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: 'rgb(99, 102, 241)',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Tiempo Promedio en Cada Estado',
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Horas'
                        }
                    }
                }
            }
        }

        const buffer = await canvas.renderToBuffer(configuration)
        return `data:image/png;base64,${buffer.toString('base64')}`
    }

    static async createHorizontalBarChart(canvas, transitions) {
        const labels = Object.keys(transitions).map(key => {
            const [from, to] = key.split(' -> ')
            return `${this.translateStatus(from)} → ${this.translateStatus(to)}`
        })
        const values = Object.values(transitions)

        const configuration = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cantidad de Transiciones',
                    data: values,
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: 'rgb(99, 102, 241)',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Flujo de Transiciones de Estado',
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10
                        }
                    }
                }
            }
        }

        const buffer = await canvas.renderToBuffer(configuration)
        return `data:image/png;base64,${buffer.toString('base64')}`
    }

    static injectData(html, data, styles, charts) {
        const dateStr = new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        html = html.replace('{{STYLES}}', styles)
        html = html.replace('{{DATE}}', dateStr)

        // RESUMEN
        html = html.replace('{{TOTAL_REPORTS}}', data.reportsByStatus.total)
        html = html.replace(
            '{{TOTAL_COMPLETED}}',
            data.reportsByStatus.data.COMPLETED ?? 0
        )
        html = html.replace(
            '{{AVG_DAYS}}',
            data.averageResolutionTime.data.averageTimeInDays ?? 0
        )

        // CHARTS
        html = html.replace('{{CHART_REPORTS_BY_STATUS}}', charts.reportsByStatus)
        html = html.replace('{{CHART_REPORTS_BY_CATEGORY}}', charts.reportsByCategory)
        html = html.replace('{{CHART_REPORTS_OVER_TIME}}', charts.reportsOverTime)
        html = html.replace('{{CHART_TIME_PER_STATUS}}', charts.timePerStatus)
        html = html.replace('{{CHART_TRANSITIONS}}', charts.statusTransitions)

        // TABLA ESTADOS
        html = html.replace(
            '{{STATUS_ROWS}}',
            Object.entries(data.reportsByStatus.data).map(([status, count]) => {
            const percent = ((count / data.reportsByStatus.total) * 100).toFixed(1)
            return `
                <tr>
                <td>${this.translateStatus(status)}</td>
                <td>${count}</td>
                <td>${percent}%</td>
                </tr>
            `
            }).join('')
        )

        // TABLA CATEGORÍAS
        html = html.replace(
            '{{CATEGORY_ROWS}}',
            Object.entries(data.reportsByCategory.data).map(([cat, count]) => {
            const percent = ((count / data.reportsByCategory.total) * 100).toFixed(1)
            return `
                <tr>
                <td>${this.translateCategory(cat)}</td>
                <td>${count}</td>
                <td>${percent}%</td>
                </tr>
            `
            }).join('')
        )

        // TABLA TIEMPO POR ESTADO
        html = html.replace(
            '{{TIME_PER_STATUS_ROWS}}',
            Object.entries(data.timePerStatus)
            .filter(([s]) => !['COMPLETED', 'CANCELLED'].includes(s))
            .map(([status, d]) => `
                <tr>
                <td>${this.translateStatus(status)}</td>
                <td>${d.averageTimeInHours}</td>
                <td>${d.averageTimeInDays}</td>
                <td>${d.totalReports}</td>
                </tr>
            `).join('')
        )

        // TRANSICIONES
        const t = data.statusTransitions.data.insights
        html = html.replace('{{COMPLETION_RATE}}', t.completionRate)
        html = html.replace('{{CANCELLATION_RATE}}', t.cancellationRate)

        return html
    }

    static translateStatus(status) {
        const translations = {
            'PENDING': 'Pendiente',
            'IN_PROGRESS': 'En Progreso',
            'COMPLETED': 'Completado',
            'CANCELLED': 'Cancelado'
        }
        return translations[status] || status
    }

    static translateCategory(category) {
        const translations = {
            'ROAD_ISSUE': 'Baches',
            'GRAFFITI': 'Grafiti',
            'ILLEGAL_DUMPING': 'Basura Ilegal',
            'STREET_LIGHT_ISSUE': 'Alumbrado Público',
            'OTHER': 'Otro'
        }
        return translations[category] || category
    }

    static translateStatusOrCategory(key) {
        return this.translateStatus(key) || this.translateCategory(key) || key
    }
}