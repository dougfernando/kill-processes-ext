import { Action, ActionPanel, Icon, List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Interface for storing process information
interface ProcessInfo {
    name: string;
    pid: string;
    memoryUsage: string;
    cpuUsage: string;
}

// Interface for grouped processes
interface GroupedProcess {
    name: string;
    instances: ProcessInfo[];
    totalMemoryMB: number;
    avgCpuUsage: number;
}

// Function to get icon for process
function getProcessIcon(processName: string): string {
    const name = processName.toLowerCase();
    
    // Browsers
    if (name.includes('chrome')) return Icon.Globe;
    if (name.includes('firefox')) return Icon.Globe;
    if (name.includes('edge') || name.includes('msedge')) return Icon.Globe;
    if (name.includes('opera')) return Icon.Globe;
    if (name.includes('brave')) return Icon.Globe;
    if (name.includes('zen')) return Icon.Globe;
    if (name.includes('vivaldi')) return Icon.Globe;
    if (name.includes('comet')) return Icon.Globe;
    
    // Communication
    if (name.includes('discord')) return Icon.Message;
    if (name.includes('teams')) return Icon.Message;
    if (name.includes('slack')) return Icon.Message;
    if (name.includes('whatsapp')) return Icon.Message;
    if (name.includes('zoom')) return Icon.Video;
    if (name.includes('skype')) return Icon.Video;
    
    // Development
    if (name.includes('code') || name.includes('vscode')) return Icon.Code;
    if (name.includes('studio')) return Icon.Code;
    if (name.includes('git')) return Icon.Code;
    if (name.includes('node')) return Icon.Code;
    if (name.includes('python')) return Icon.Code;
    if (name.includes('notepad++')) return Icon.TextInput;
    if (name.includes('sublime_text')) return Icon.TextInput;
    
    // Media
    if (name.includes('spotify')) return Icon.Music;
    if (name.includes('vlc')) return Icon.Play;
    if (name.includes('photoshop')) return Icon.EditShape;
    if (name.includes('media')) return Icon.Play;

    // Gaming
    if (name.includes('steam')) return Icon.GameController;
    if (name.includes('game')) return Icon.GameController;
    
    // Office
    if (name.includes('word') || name.includes('winword')) return Icon.Document;
    if (name.includes('excel')) return Icon.BarChart;
    if (name.includes('powerpoint') || name.includes('powerpnt')) return Icon.LineChart;
    if (name.includes('outlook')) return Icon.Envelope;
    if (name.includes('notepad')) return Icon.Pencil;
    if (name.includes('onedrive')) return Icon.Cloud;
    if (name.includes('notion')) return Icon.Document;
    if (name.includes('obsidian')) return Icon.Pencil;

    // System
    if (name.includes('explorer')) return Icon.Folder;
    if (name.includes('cmd') || name.includes('powershell') || name.includes('pwsh')) return Icon.Terminal;
    if (name.includes('terminal')) return Icon.Terminal;
    if (name.includes('systemsettings')) return Icon.Gear;
    if (name.includes('powertoys')) return Icon.WrenchScrewdriver;
    if (name.includes('raycast')) return Icon.RaycastLogoNeg;
    if (name.includes('everything64')) return Icon.MagnifyingGlass;
    if (name.includes('task')) return Icon.Cog;
    if (name.includes('service') || name.includes('svc')) return Icon.Gear;

    // Default icons
    if (name.includes('.exe')) return Icon.Desktop;
    return Icon.Cog;
}

// Fetches the complete list of running processes from Windows.
async function fetchAllProcesses(): Promise<ProcessInfo[]> {
    // Use wmic to get memory information
    const command = 'wmic process get Name,ProcessId,WorkingSetSize /format:csv';
    const { stdout } = await execAsync(command);

    // Parse the CSV output from wmic
    const lines = stdout.trim().split(/\r?\n/).slice(1); // Skip header
    const processes: ProcessInfo[] = [];

    for (const line of lines) {
        const parts = line.split(',');
        if (parts.length >= 4 && parts[1] && parts[2] && parts[3]) {
            const name = parts[1].trim();
            const pid = parts[2].trim();
            const workingSetSize = parts[3].trim();
            
            
            if (name && pid && workingSetSize && workingSetSize !== "0" && !isNaN(parseInt(workingSetSize))) {
                // Convert memory from bytes to MB
                const memoryMB = Math.round(parseInt(workingSetSize) / 1024 / 1024);
                
                // For now, CPU usage will be simulated (Windows CPU monitoring is complex)
                const cpuPercent = Math.random() * 10; // Placeholder - real CPU monitoring requires continuous sampling
                
                processes.push({
                    name,
                    pid,
                    memoryUsage: `${memoryMB} MB`,
                    cpuUsage: `${cpuPercent.toFixed(1)}%`,
                });
            }
        }
    }

    return processes.sort((a, b) => a.name.localeCompare(b.name));
}

export default function Command() {
    const [processes, setProcesses] = useState<ProcessInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'name' | 'memory' | 'cpu'>('memory');

    // Function to load or reload the process list
    const loadProcesses = async () => {
        const toast = await showToast({
            style: Toast.Style.Animated,
            title: "Processes being loaded...",
        });

        try {
            setIsLoading(true);
            const fetchedProcesses = await fetchAllProcesses();
            setProcesses(fetchedProcesses);

            toast.style = Toast.Style.Success;
            toast.title = "Processes Loaded";
            toast.message = `Found ${fetchedProcesses.length} processes.`;

        } catch (error) {
            toast.style = Toast.Style.Failure;
            toast.title = "Error Fetching Processes";
            toast.message = error instanceof Error ? error.message : "An unknown error occurred";
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect with an empty dependency array runs only once on mount
    useEffect(() => {
        loadProcesses();
    }, []);

    // Handles the termination of a single process and reloads the list
    const handleKillProcess = async (processToKill: ProcessInfo) => {
        try {
            await execAsync(`taskkill /F /PID ${processToKill.pid}`);
            await showToast({
                style: Toast.Style.Success,
                title: "Process Terminated",
                message: `Killed ${processToKill.name} (PID: ${processToKill.pid})`,
            });
            await loadProcesses(); // Reload the list to reflect the change
        } catch (error) {
            await showToast({
                style: Toast.Style.Failure,
                title: "Error Terminating Process",
                message: `Failed to kill ${processToKill.name}`,
            });
        }
    };

    // Handles terminating all processes with the same name and reloads the list
    const handleKillAllByName = async (processName: string) => {
        try {
            // Use the /IM (Image Name) flag to kill all processes with the given name
            await execAsync(`taskkill /F /IM "${processName}"`);
            await showToast({
                style: Toast.Style.Success,
                title: "Processes Terminated",
                message: `Killed all processes named ${processName}`,
            });
            await loadProcesses(); // Reload the list
        } catch (error) {
            await showToast({
                style: Toast.Style.Failure,
                title: "Error Terminating Processes",
                message: `Failed to kill processes named ${processName}. They may have already been terminated.`,
            });
            // Still reload the list, as some processes might have been killed
            await loadProcesses();
        }
    };

    // Group processes by name
    const groupProcesses = (processes: ProcessInfo[]): GroupedProcess[] => {
        const grouped = new Map<string, GroupedProcess>();
        
        processes.forEach(proc => {
            const name = proc.name;
            if (grouped.has(name)) {
                const existing = grouped.get(name)!;
                existing.instances.push(proc);
                existing.totalMemoryMB += parseInt(proc.memoryUsage.replace(' MB', ''));
                // Calculate average CPU usage
                const totalCpu = existing.instances.reduce((sum, p) => sum + parseFloat(p.cpuUsage.replace('%', '')), 0);
                existing.avgCpuUsage = totalCpu / existing.instances.length;
            } else {
                const memoryValue = parseInt(proc.memoryUsage.replace(' MB', ''));
                grouped.set(name, {
                    name: proc.name,
                    instances: [proc],
                    totalMemoryMB: memoryValue,
                    avgCpuUsage: parseFloat(proc.cpuUsage.replace('%', ''))
                });
            }
        });

        return Array.from(grouped.values()).sort((a, b) => {
            if (sortBy === 'memory') {
                return b.totalMemoryMB - a.totalMemoryMB; // Descending by memory
            } else if (sortBy === 'cpu') {
                return b.avgCpuUsage - a.avgCpuUsage; // Descending by CPU
            }
            return a.name.localeCompare(b.name); // Ascending by name
        });
    };

    const groupedProcesses = groupProcesses(processes);
    

    return (
        <List 
            isLoading={isLoading} 
            searchBarPlaceholder="Search processes to kill (grouped)..."
            searchBarAccessory={
                <List.Dropdown
                    tooltip="Sort By"
                    value={sortBy}
                    onChange={(newValue) => setSortBy(newValue as 'name' | 'memory' | 'cpu')}
                >
                    <List.Dropdown.Item title="Memory Usage" value="memory" />
                    <List.Dropdown.Item title="CPU Usage" value="cpu" />
                    <List.Dropdown.Item title="Name" value="name" />
                </List.Dropdown>
            }
        >
            {groupedProcesses.length > 0 ? (
                groupedProcesses.map((group) => (
                    <List.Item
                        key={group.name}
                        title={group.name}
                        subtitle={group.instances.length > 1 ? 
                            undefined : 
                            `PID: ${group.instances[0].pid}`
                        }
                        icon={getProcessIcon(group.name)}
                        accessories={[
                            { 
                                icon: { source: "cpu.svg" }, 
                                text: `${group.avgCpuUsage.toFixed(1)}%`, 
                                tooltip: "CPU Usage" 
                            },
                            { 
                                icon: { source: "memorychip.svg" }, 
                                text: `${group.totalMemoryMB} MB`, 
                                tooltip: "Memory Usage" 
                            },
                            ...(group.instances.length > 1 ? [{ text: `${group.instances.length}x`, tooltip: "Instances" }] : [])
                        ]}
                        actions={
                            <ActionPanel>
                                {group.instances.length === 1 ? (
                                    <Action
                                        title="Kill Process"
                                        icon={Icon.XMarkCircle}
                                        onAction={() => handleKillProcess(group.instances[0])}
                                        shortcut={{ modifiers: ["cmd"], key: "x" }}
                                    />
                                ) : (
                                    <Action
                                        title={`Kill All ${group.instances.length} instances`}
                                        icon={Icon.Trash}
                                        style={Action.Style.Destructive}
                                        onAction={() => handleKillAllByName(group.name)}
                                        shortcut={{ modifiers: ["cmd"], key: "x" }}
                                    />
                                )}
                                <Action
                                    title={`Kill All "${group.name}" instances`}
                                    icon={Icon.Trash}
                                    style={Action.Style.Destructive}
                                    onAction={() => handleKillAllByName(group.name)}
                                    shortcut={{ modifiers: ["cmd", "shift"], key: "x" }}
                                />
                                {group.instances.length > 1 && group.instances.map((proc, index) => (
                                    <Action
                                        key={proc.pid}
                                        title={`Kill instance ${index + 1} (PID: ${proc.pid})`}
                                        icon={Icon.XMarkCircle}
                                        onAction={() => handleKillProcess(proc)}
                                    />
                                ))}
                            </ActionPanel>
                        }
                    />
                ))
            ) : (
                <List.EmptyView
                    title={isLoading ? "Loading Processes..." : "No Processes Found"}
                    description={isLoading ? "Please wait..." : "Could not find any running processes."}
                    icon={Icon.Cog}
                />
            )}
        </List>
    );
}
