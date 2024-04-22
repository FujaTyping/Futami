const os = require('os');

function GetCPUUsage() {
    const Cpu = os.cpus();
    const CPUUsage = Cpu.map((cpu) => {
        const Total = cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
        const Idle = cpu.times.idle;
        const UsagePercentage = ((Total - Idle) / Total) * 100;

        return UsagePercentage.toFixed(2) + ' %';
    });
    return CPUUsage;
}

function GetRAMUsage() {
    const TotalMemory = os.totalmem();
    const FreeMemory = os.freemem();
    const UsedMemory = TotalMemory - FreeMemory;
    const MemoryUsagePercentage = ((UsedMemory / TotalMemory) * 100).toFixed(2);
    return MemoryUsagePercentage + ' %';
}

module.exports = { GetCPUUsage, GetRAMUsage };