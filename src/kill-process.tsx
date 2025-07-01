import { Action, ActionPanel, Icon, List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Interface for storing process information
interface ProcessInfo {
    name: string;
    pid: string;
}

// Fetches the complete list of running processes from Windows.
async function fetchAllProcesses(): Promise<ProcessInfo[]> {
    const command = "tasklist /nh /fo csv";
    const { stdout } = await execAsync(command);

    // Parse the CSV output from tasklist
    const processes: ProcessInfo[] = stdout
        .trim()
        .split(/\r?\n/)
        .map((line) => {
            const parts = line.replace(/"/g, "").split(",");
            return {
                name: parts[0],
                pid: parts[1],
            };
        })
        .filter((p) => p.name && p.pid); // Ensure both name and PID are valid

    return processes;
}

export default function Command() {
    const [processes, setProcesses] = useState<ProcessInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <List isLoading={isLoading} searchBarPlaceholder="Filter running processes...">
            {processes.length > 0 ? (
                processes.map((proc) => (
                    <List.Item
                        key={proc.pid}
                        title={proc.name}
                        subtitle={`PID: ${proc.pid}`}
                        icon={Icon.Cog}
                        actions={
                            <ActionPanel>
                                <Action
                                    title="Kill Process"
                                    icon={Icon.XMarkCircle}
                                    onAction={() => handleKillProcess(proc)}
                                    shortcut={{ modifiers: ["cmd"], key: "k" }}
                                />
                                <Action
                                    title={`Kill All "${proc.name}" instances`}
                                    icon={Icon.Trash}
                                    style={Action.Style.Destructive}
                                    onAction={() => handleKillAllByName(proc.name)}
                                    shortcut={{ modifiers: ["cmd", "shift"], key: "k" }}
                                />
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