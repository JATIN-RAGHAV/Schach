package main

import (
	"os"
	tea "charm.land/bubbletea/v2"
	lipgloss "charm.land/lipgloss/v2"
)

var prog *tea.Program;

func main() {
	prog = tea.NewProgram(InitModel())
	if _,err := prog.Run(); err != nil{
		lipgloss.Println(styles_Red.Render("Error"))
		os.Exit(1)
	}
}
