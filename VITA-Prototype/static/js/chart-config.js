// Chart.js configurations for Hospital Management System

/**
 * Configure and render appointment statistics chart
 * @param {string} elementId - Canvas element ID
 * @param {Object} data - Chart data containing labels and values
 */
function renderAppointmentChart(elementId, data) {
    const ctx = document.getElementById(elementId);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels || [],
            datasets: [{
                label: 'Appointments',
                data: data.values || [],
                backgroundColor: [
                    'rgba(255, 205, 86, 0.6)', // scheduled
                    'rgba(75, 192, 192, 0.6)',  // completed
                    'rgba(255, 99, 132, 0.6)'   // cancelled
                ],
                borderColor: [
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(255, 99, 132)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 10,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    bodySpacing: 5,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    usePointStyle: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

/**
 * Configure and render document analysis chart
 * @param {string} elementId - Canvas element ID
 * @param {Object} data - Chart data containing dates and counts
 */
function renderDocumentChart(elementId, data) {
    const ctx = document.getElementById(elementId);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates || [],
            datasets: [{
                label: 'Analyzed Documents',
                data: data.counts || [],
                backgroundColor: 'rgba(54, 162, 235, 0.3)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Configure and render medical terminology breakdown chart
 * @param {string} elementId - Canvas element ID
 * @param {Object} data - Chart data containing terms and frequencies
 */
function renderTerminologyChart(elementId, data) {
    const ctx = document.getElementById(elementId);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.terms || [],
            datasets: [{
                data: data.frequencies || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}%`;
                        }
                    }
                }
            },
            cutout: '70%',
            radius: '90%'
        }
    });
}

/**
 * Configure and render patient demographics chart
 * @param {string} elementId - Canvas element ID
 * @param {Object} data - Chart data containing age groups and counts
 */
function renderDemographicsChart(elementId, data) {
    const ctx = document.getElementById(elementId);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.ageGroups || [],
            datasets: [{
                label: 'Patients',
                data: data.counts || [],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            barPercentage: 0.7
        }
    });
}

// Initialize dashboard charts if data is available
document.addEventListener('DOMContentLoaded', function() {
    // Check for appointment stats chart
    const appointmentChartEl = document.getElementById('appointmentStatsChart');
    if (appointmentChartEl) {
        const chartData = {
            labels: ['Scheduled', 'Completed', 'Cancelled'],
            values: [
                appointmentChartEl.getAttribute('data-scheduled') || 0,
                appointmentChartEl.getAttribute('data-completed') || 0,
                appointmentChartEl.getAttribute('data-cancelled') || 0
            ]
        };
        renderAppointmentChart('appointmentStatsChart', chartData);
    }
    
    // Check for document analysis chart
    const documentChartEl = document.getElementById('documentAnalysisChart');
    if (documentChartEl) {
        const chartDataAttr = documentChartEl.getAttribute('data-chart');
        if (chartDataAttr) {
            try {
                const chartData = JSON.parse(chartDataAttr);
                renderDocumentChart('documentAnalysisChart', chartData);
            } catch (e) {
                console.error('Error parsing document chart data:', e);
            }
        }
    }
    
    // Check for terminology chart
    const terminologyChartEl = document.getElementById('terminologyChart');
    if (terminologyChartEl) {
        const chartDataAttr = terminologyChartEl.getAttribute('data-chart');
        if (chartDataAttr) {
            try {
                const chartData = JSON.parse(chartDataAttr);
                renderTerminologyChart('terminologyChart', chartData);
            } catch (e) {
                console.error('Error parsing terminology chart data:', e);
            }
        }
    }
    
    // Check for demographics chart
    const demographicsChartEl = document.getElementById('demographicsChart');
    if (demographicsChartEl) {
        const chartDataAttr = demographicsChartEl.getAttribute('data-chart');
        if (chartDataAttr) {
            try {
                const chartData = JSON.parse(chartDataAttr);
                renderDemographicsChart('demographicsChart', chartData);
            } catch (e) {
                console.error('Error parsing demographics chart data:', e);
            }
        }
    }
});
