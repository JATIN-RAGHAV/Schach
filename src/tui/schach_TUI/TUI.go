package schach_TUI

import (
	tea "charm.land/bubbletea/v2"
)

var prog *tea.Program;

func Handler(){
	newModel := InitModel();
	prog = tea.NewProgram(newModel);
	if _,err := prog.Run(); err != nil{
		return
	}

}
