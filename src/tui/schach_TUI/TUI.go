package schach_TUI

import (
	tea "charm.land/bubbletea/v2"
	"github.com/charmbracelet/ssh"
)

var prog *tea.Program;

func Handler(s ssh.Session) (tea.Model, []tea.ProgramOption) {
	newModel := InitModel();
	return newModel, []tea.ProgramOption{}
}
