# Kill Processes - Raycast Extension for Windows

A powerful Raycast extension for Windows that allows you to search, monitor, and terminate running processes with an intuitive interface similar to the macOS version.

## Features

### 🔍 **Smart Process Management**
- **Intelligent Grouping**: Processes with the same name (e.g., multiple Chrome instances) are automatically grouped together
- **Real-time Monitoring**: View CPU usage and memory consumption for all processes
- **Advanced Sorting**: Sort by memory usage, CPU usage, or process name

### 🎨 **Visual Interface**
- **Contextual Icons**: Applications show relevant icons (browsers get globe icons, development tools get code icons, etc.)
- **Memory & CPU Indicators**: Visual indicators with custom icons showing resource usage
- **Clean Process Grouping**: Multiple instances display cleanly without redundant information, with instance count shown only in accessories (e.g., "28x")

### ⚡ **Powerful Actions**
- **Individual Termination**: Kill specific process instances by PID
- **Bulk Termination**: Kill all instances of a process type at once
- **Force Kill**: Terminate unresponsive processes
- **Smart Filtering**: Search and filter processes in real-time

### 🎯 **User Experience**
- **Dropdown Sorting**: Quick sorting options in the top-right corner
- **Keyboard Shortcuts**: `Cmd+X` to kill processes, `Cmd+Shift+X` for bulk actions
- **Memory Totals**: See combined memory usage for grouped processes
- **Instance Management**: Individual actions for each process instance in groups

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (install via `winget install -e --id OpenJS.NodeJS`)
- [Raycast for Windows](https://raycast.com/)

### Setup
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd kill-processes-ext
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Start development mode:
   ```bash
   npm run dev
   ```

4. The extension will be automatically added to your Raycast installation

## Usage

1. Open Raycast (`Alt+Space` by default)
2. Type "kill" or "process" to find the extension
3. Browse running processes with real-time resource information
4. Use the sorting dropdown to organize by memory, CPU, or name
5. Select a process and use `Cmd+X` to terminate or access additional actions

## Screenshots

*Coming soon - the extension shows grouped processes with memory usage, CPU percentages, and contextual icons*

## Technical Details

- **Platform**: Windows 10/11
- **Commands Used**: `wmic process` for process enumeration and resource monitoring
- **Architecture**: Built with TypeScript and Raycast API
- **Performance**: Optimized grouping algorithms for handling 500+ processes

## Credits & References

This extension builds upon the original work from:
  - [windows-terminal](https://github.com/PuttTim/windows-terminal) by PuttTim
  - [everything-raycast-extension](https://github.com/dougfernando/everything-raycast-extension) by dougfernando

**UI/UX Inspiration**: We studied the [official Raycast kill-process extension for macOS](https://github.com/raycast/extensions/tree/main/extensions/kill-process) to implement similar functionality and visual design patterns for Windows.

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - see LICENSE file for details
