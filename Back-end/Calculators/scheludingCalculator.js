class SchedulingCalculator {
    constructor(processes, quantum, overhead) {
        this.processes = processes;
        this.quantum = quantum;
        this.overhead = overhead;
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

    roundRobin() {
        let acc = 0;
        let total = 0;
        let remaining = [...this.processes];
        let currentTime = 0;

        while (remaining.length > 0) {
            console.log(remaining)
            let arrivedProcesses = remaining.filter(process => process.arrival <= currentTime);
            let next = arrivedProcesses.shift();
            let executionTime = Math.min(this.quantum, next.execution);

            total = currentTime; 
            total += executionTime; 
            acc += total - next.arrival;
            next.execution -= executionTime;
            remaining = remaining.filter(process => process !== next);

            if (next.execution > 0) {
                currentTime = total + this.overhead;
                acc += this.overhead;
                next.arrival = currentTime;
                remaining.push(next);
                remaining.sort((a, b) => a.arrival - b.arrival);
            } else {
                currentTime = total;
            }
        }

        return acc / this.processes.length;
    }

    edf() {
        let acc = 0;
        let total = 0;
        let remaining = [...this.processes];
        let currentTime = 0;
    
        while (remaining.length > 0) {
            let arrivedProcesses = remaining.filter(process => process.arrival <= currentTime); 
            arrivedProcesses.sort((a, b) => a.deadline - b.deadline);            
            let next = arrivedProcesses.shift();
            let executionTime = Math.min(this.quantum, next.execution);

            total = currentTime;
            total += executionTime;
            acc += total - next.arrival;
            next.execution -= executionTime;
            remaining = remaining.filter(process => process !== next); 

            if (next.execution > 0) {
                currentTime = total + this.overhead;
                acc += this.overhead;
                next.arrival = currentTime;
                remaining.push(next);
                remaining.sort((a, b) => a.arrival - b.arrival); 
            } else {
                currentTime = total; 
            }
        }
    
        return acc / this.processes.length;
    }
}

module.exports = SchedulingCalculator;