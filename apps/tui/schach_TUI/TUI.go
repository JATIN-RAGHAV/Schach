package schach_TUI

import (
	tea "charm.land/bubbletea/v2"
	bwish "charm.land/wish/v2/bubbletea"
	ssh "github.com/charmbracelet/ssh"
)

var prog *tea.Program;

func Handler(){
	newModel := InitModel();
	prog = tea.NewProgram(newModel);
	if _,err := prog.Run(); err != nil{
		return
	}
}

func TeaHandler(s ssh.Session) (*tea.Program) {
	// This should never fail, as we are using the activeterm middleware.
	pty, _, _ := s.Pty()

	m := InitModel()
	m.width = pty.Window.Width
	m.height = pty.Window.Height

	prog = tea.NewProgram(m,bwish.MakeOptions(s)...);

	return prog
}
