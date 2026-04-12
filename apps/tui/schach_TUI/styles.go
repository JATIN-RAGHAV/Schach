package schach_TUI;

import lipgloss "charm.land/lipgloss/v2"

var (
	styles_Red = lipgloss.NewStyle().Foreground(lipgloss.Color("#FF0000"))
	styles_Green = lipgloss.NewStyle().Foreground(lipgloss.Color("#00FF00"))
	styles_Blue = lipgloss.NewStyle().Foreground(lipgloss.Color("#0055DD"))
	styles_Red_text_border = lipgloss.NewStyle().Border(lipgloss.RoundedBorder(), true).BorderForeground(lipgloss.Color("#FF0000"));
	styles_left_align = lipgloss.NewStyle().Width(20).Align(lipgloss.Left)
	styles_right_align = lipgloss.NewStyle().Width(20).Align(lipgloss.Right)
)
