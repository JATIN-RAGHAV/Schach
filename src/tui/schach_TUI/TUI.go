package schach_TUI

import (
	tea "charm.land/bubbletea/v2"
	"github.com/charmbracelet/ssh"
)

var prog *tea.Program;

func Handler(){
	newModel := InitModel();
	prog = tea.NewProgram(newModel);
	if _,err := prog.Run(); err != nil{
		return
	}

}

func TeaHandler(s ssh.Session) (tea.Model, []tea.ProgramOption) {
    return InitModel(), []tea.ProgramOption{}
}
