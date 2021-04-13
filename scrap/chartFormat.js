var chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: array,
            backgroundColor: [
                "#fd5a3e",
                "#ffd050",
                "#aaaaaa",
                "#97cc64",
                "#d35ebe"
            ],
            borderColor: "rgba(255, 255, 255, 0.5)"
        }],

        labels: [
            'Failed',
            'Broken',
            'Skipped',
            'Passed',
            'Unknown'
        ]
    },
    options: {
        legend: {
            display: true,
            labels: {
                boxWidth: 15
            },
            position: 'bottom'
        }
    }
});

/////////////////////////////////////////////////////////////////////////////////////

var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        datasets: [{
            data: array,
            backgroundColor: "#6dd6cd",
            borderWidth: 1,
            borderColor: "#46827d"
        }],
        labels: [
            'blocker',
            'critical',
            'normal',
            'minor',
            'trivial'
        ]
    },
    options: {
        legend: {
            display: false
        }
    }
});

/////////////////////////////////////////////////////////////////////////////////////

var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Category'],
        datasets: [
            {
                label: 'Product defects',
                backgroundColor: "#800026",
                data: [arrayN[0]],
                borderWidth: 1,
                borderColor: "#63001e"
            },
            {
                label: 'Test defects',
                backgroundColor: "#d31121",
                data: [arrayN[1]],
                borderWidth: 1,
                borderColor: "#a30d19"
            },
            {
                label: 'Outdated tests',
                backgroundColor: "#fa5c2e",
                data: [arrayN[2]],
                borderWidth: 1,
                borderColor: "#cf4b25"
            },
            {
                label: 'Infrastructure problems',
                backgroundColor: "#feab4b",
                data: [arrayN[3]],
                borderWidth: 1,
                borderColor: "#cc893b"
            },
            {
                label: 'Ignored tests',
                backgroundColor: "#fee087",
                data: [arrayN[4]],
                borderWidth: 1,
                borderColor: "#d1b86d"
            }
        ]
    },
    options: {
        legend: {
            display: true,
            labels: {
                boxWidth: 15
            },
            position: 'bottom'
        },
        scales:{
            xAxes: [{
                ticks: {
                    display: false
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});