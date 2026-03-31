package schach_TUI

import (
	"os"
	tea "charm.land/bubbletea/v2"
	lipgloss "charm.land/lipgloss/v2"
)

var prog *tea.Program;

func TUI() {
	prog = tea.NewProgram(InitModel())
	if _,err := prog.Run(); err != nil{
		lipgloss.Println(styles_Red.Render("Error"))
		os.Exit(1)
	}
}
