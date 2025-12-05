# Changelog

All notable changes to the Kill Processes extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.2] - 2025-12-04

### 🔧 Fixed

#### **Windows Compatibility**
- 🔧 **Deprecated WMIC Command**: Replaced deprecated `wmic` command with modern PowerShell `Get-Process`
- ⚡ **Modern Windows Support**: Extension now works on Windows 11 and latest Windows 10 versions where `wmic` has been removed
- 📊 **Improved Data Accuracy**: PowerShell provides more reliable process information with JSON output format
- 🖥️ **Better CPU Metrics**: Real CPU time data from PowerShell instead of simulated values

### 🔄 Technical Changes
- **Command Migration**: Switched from `wmic process get Name,ProcessId,WorkingSetSize` to PowerShell's `Get-Process`
- **Output Format**: Changed from CSV parsing to JSON parsing for better reliability
- **Buffer Size**: Increased output buffer to 10MB to handle systems with many processes
- **Error Handling**: Enhanced error handling for PowerShell command execution

---

## [2.0.1] - 2025-07-29

### 🐛 Bug Fixes

#### **UI Information Duplication**
- **Fixed Redundant Instance Information**: Removed duplicate instance count display from process subtitles
- **Cleaner Visual Hierarchy**: Instance count now only appears in the right-side accessories (e.g., "28x")
- **Improved Readability**: For grouped processes, subtitle is now empty instead of showing redundant instance count
- **Consistent Display**: Single processes continue to show PID in subtitle while grouped processes show only essential info

### 🔧 Technical Changes
- **Subtitle Logic**: Optimized subtitle display logic to eliminate information redundancy
- **UI Consistency**: Better alignment with modern UI principles of non-redundant information display

---

## [2.0.0] - 2025-01-29

### 🎉 Major Enhancement Release

This release adds significant UI/UX improvements and new functionality inspired by the macOS Raycast kill-process extension, implementing Windows-specific solutions for process management.

### ✨ Added

#### **Smart Process Grouping**
- **Intelligent Grouping**: Processes with the same name (e.g., multiple Chrome instances) are now automatically grouped together
- **Instance Counting**: Groups show as "chrome.exe (5 instances)" with combined statistics
- **Individual Actions**: Access individual process instances within groups via action panel
- **Memory Aggregation**: Combined memory usage calculation for grouped processes
- **CPU Averaging**: Average CPU usage across all instances in a group

#### **Enhanced Visual Interface**
- **Contextual Icons**: Applications now display relevant icons based on their type:
  - 🌐 Browsers (Chrome, Firefox, Edge) → Globe icon
  - 💬 Communication (Discord, Teams, Slack) → Message icon
  - 🎥 Video (Zoom, Skype) → Video icon
  - ⚙️ Development (VS Code, Node.js) → Code icon
  - 🎵 Media (Spotify, VLC) → Music/Play icons
  - 🎮 Gaming (Steam) → Game Controller icon
  - 📄 Office (Word, Excel, PowerPoint) → Document icons
  - 📁 System (Explorer, PowerShell) → System icons
- **Resource Indicators**: Custom CPU and Memory icons in accessories section
- **Visual Hierarchy**: Better information organization with tooltips

#### **Advanced Sorting & Filtering**
- **Dropdown Sorting**: Added sorting dropdown in top-right corner with options:
  - Memory Usage (default) - sorts by highest memory consumption
  - CPU Usage - sorts by highest CPU utilization
  - Name - alphabetical sorting
- **Real-time Resource Monitoring**: Live CPU and memory usage display
- **Smart Filtering**: Enhanced search capabilities across process names

#### **Improved Resource Monitoring**
- **Memory Information**: Real working set memory usage in MB
- **CPU Usage**: Simulated CPU usage percentages (placeholder for future real monitoring)
- **Resource Validation**: Filtered out processes with invalid/zero memory data
- **Performance Optimization**: Efficient data parsing and validation

#### **Enhanced User Experience**
- **Updated Icons**: Custom CPU and memory chip SVG icons optimized for light/dark themes
- **Better Accessories**: Memory and CPU usage with dedicated icons and tooltips
- **Improved Actions**: Context-aware actions for single vs. multiple instances
- **Instance Management**: Individual kill actions for each process in a group

### 🔧 Changed

#### **Technical Improvements**
- **Command Optimization**: Switched to `wmic process get Name,ProcessId,WorkingSetSize` for better data accuracy
- **Data Validation**: Enhanced parsing with null/empty value filtering
- **Memory Calculation**: Improved bytes-to-MB conversion with proper rounding
- **Performance**: Optimized grouping algorithms for handling 500+ processes efficiently

#### **Interface Updates**
- **Extension Icon**: Updated to new extension_icon.png
- **Keyboard Shortcuts**: Changed from `Cmd+K` to `Cmd+X` (avoiding Raycast reserved shortcuts)
- **Package Metadata**: Updated extension title to "Kill Processes" with proper casing
- **Preferences**: Added proper label for settings configuration

#### **Visual Enhancements**
- **Icon Colors**: SVG icons optimized for both light and dark themes (#666666 color)
- **Accessories Layout**: Better organization of CPU, memory, and instance information
- **Process Titles**: Enhanced titles showing instance counts for grouped processes
- **Subtitle Information**: Contextual subtitles showing PIDs or instance counts

### 🐛 Fixed

- **Memory Display**: Fixed issue where all processes showed 0 MB memory usage
- **Data Parsing**: Resolved CSV parsing issues with wmic command output
- **Duplicate Information**: Removed duplicate memory information from subtitle and accessories
- **Keyboard Shortcuts**: Fixed reserved shortcut conflicts with Raycast
- **Package Validation**: Fixed package.json validation errors for Raycast store requirements

### 🔄 Technical Changes

- **Dependencies**: Updated to latest Raycast API versions
- **Type Safety**: Enhanced TypeScript interfaces for better type checking
- **Error Handling**: Improved error handling for process enumeration failures
- **Code Organization**: Better separation of concerns with dedicated utility functions

### 📋 Developer Experience

- **Documentation**: Comprehensive README.md with installation and usage instructions
- **Code Comments**: Enhanced code documentation and inline comments
- **Debugging**: Added console logging for troubleshooting memory calculation issues
- **Testing**: Improved development workflow with better error reporting

---

## [1.0.0] - Initial Release

### Added
- Basic process listing functionality
- Simple kill process actions
- Search and filter capabilities
- Basic Windows process enumeration via tasklist command

### Features
- List running processes on Windows
- Kill individual processes by PID
- Kill all instances of a process by name
- Search processes by name
- Basic toast notifications for actions

---

## Credits & References

### Original Work
This extension is built upon the original [kill-processes-ext](https://github.com/dougfernando/kill-processes-ext) by **dougfernando**.

### Enhancement Inspiration
The v2.0.0 enhancements were implemented by studying and adapting UI/UX patterns from:
- [Official Raycast kill-process extension for macOS](https://github.com/raycast/extensions/tree/main/extensions/kill-process) - for visual design and user experience patterns
- [windows-terminal extension](https://github.com/PuttTim/windows-terminal) - for Windows-specific implementation techniques
- [everything-raycast-extension](https://github.com/dougfernando/everything-raycast-extension) - for additional Raycast API usage patterns

### Implementation Details
All features were implemented from scratch for Windows using:
- Windows `wmic` commands for process enumeration
- Custom TypeScript algorithms for process grouping and resource calculation
- Raycast API components for visual interface elements
- Windows-specific icon mapping and resource monitoring

Special thanks to the Raycast team and community for the excellent APIs and documentation that made this enhancement possible.