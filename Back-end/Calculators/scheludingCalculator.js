class SchedulingCalculator {
    constructor(processes) {
        this.processes = processes;
    }

    fifo() {
        let acc = 0;
        let total = this.processes[0].arrival;

        for (let i = 0; i < this.processes.length; i++) {
            if (total < this.processes[i].arrival) {
                total = this.processes[i].arrival; 
            }
            total += this.processes[i].execution; 
            acc += total - this.processes[i].arrival; 
        }

        return acc / this.processes.length; 
    }

    sjf() {
        let acc = 0;
        let total = 0;
        let remaining = [...this.processes];
    
        while (remaining.length > 0) {
            let available = remaining.filter(process => process.arrival <= total);
    
            if (available.length === 0) {
                let next = remaining.reduce((a, b) => (a.arrival < b.arrival) ? a : b);
                total = next.arrival;
            } else {
                available.sort((a, b) => a.execution - b.execution);
                let next = available.shift();
                total += next.execution;
                acc += total - next.arrival;
                remaining = remaining.filter(process => process !== next);
            }
        }
    
        return acc / this.processes.length;
    }  
}

let processes = [
    { arrival: 0, execution: 4, deadline: 7},
    { arrival: 2, execution: 2, deadline: 5},
    { arrival: 4, execution: 1, deadline: 8},
    { arrival: 6, execution: 3, deadline: 10}
];

let scheduler = new SchedulingCalculator(processes);
console.log(scheduler.sjf());