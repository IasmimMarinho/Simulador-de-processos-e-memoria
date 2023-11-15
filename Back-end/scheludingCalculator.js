class SchedulingCalculator {
    constructor(processes, quantum, overhead) {
        this.processes = processes;
        this.quantum = quantum;
        this.overhead = overhead;
    }

    fifo() {
        if (this.processes.length === 0) {
            console.error('processes empty');
            return 0;
        }

        let acc = 0;
        let remaining = JSON.parse(JSON.stringify(this.processes));
        let total = remaining[0].arrival;

        for (let i = 0; i < remaining.length; i++) {
            if (total < remaining[i].arrival) {
                total = remaining[i].arrival;
            }
            total += remaining[i].execution;
            acc += total - remaining[i].arrival;
        }

        return acc / this.processes.length;
    }

    sjf() {
        if (this.processes.length === 0) {
            console.error('processes empty');
            return 0;
        }

        let acc = 0;
        let total = 0;
        let remaining = JSON.parse(JSON.stringify(this.processes));

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
        if (this.processes.length === 0) {
            console.error('processes empty');
            return 0;
        }

        let acc = 0;
        let total = 0;
        let remaining = JSON.parse(JSON.stringify(this.processes));
        let currentTime = 0;

        while (remaining.length > 0) {
            let arrivedProcesses = remaining.filter(process => process.arrival <= currentTime);
            if (arrivedProcesses.length > 0) {
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
            } else {
                currentTime++;
            }
        }

        return acc / this.processes.length;
    }

    edf() {
        if (this.processes.length === 0) {
            console.error('processes empty');
            return 0;
        }

        this.processes.forEach(process => {
            process.deadline += process.arrival;
        });

        let acc = 0;
        let total = 0;
        let remaining = JSON.parse(JSON.stringify(this.processes));
        let currentTime = 0;

        while (remaining.length > 0) {
            let arrivedProcesses = remaining.filter(process => process.arrival <= currentTime);
            if (arrivedProcesses.length > 0) {
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
            } else {
                currentTime++;
            }
        }

        return acc / this.processes.length;
    }
}