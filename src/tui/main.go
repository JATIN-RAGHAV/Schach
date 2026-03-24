package main

import (
	"fmt"
	"os"

	tea "charm.land/bubbletea/v2"
	lipgloss "charm.land/lipgloss/v2"
)

type model struct {
	options []string
	current int
	width int
	height int
	started bool
}

styles := {
	red = lipgloss.NewStyle().Foreground(lipgloss.Color("#FF0000"))
	green = lipgloss.NewStyle().Foreground(lipgloss.Color("#00FF00"))
	blue = lipgloss.NewStyle().Foreground(lipgloss.Color("#0055DD"))
}

// The state of the App, called model
func InitModel () model {
	return model {
		options: []string{
			"War and Peace",
			"The Idiot",
			"Dune",
			"The Stand",
			"The God of Small Things",
		},
		current:0,
		width:0,
		height:0,
		started:false,
	}
}

// This initializes the model
func (m model) Init () tea.Cmd {
	return nil;
}

// This updates the model
func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyPressMsg:
		switch msg.String() {
		case "j":
			if (m.current < (len(m.options)-1)) && (m.started){
				m.current++;
			}
		case "k":
			if (m.current > 0) && m.started {
				m.current--;
			}
		case "q","esc":
			return m,tea.Quit
		case "enter":
            m.started = true
		}
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
	}
	return m,nil
}

// This renders the model
func (m model) View() (v tea.View) {
	var s string;
	if(m.started){
		for i, book := range m.options {
			if(m.current == i) {
				s += red.Render(">") + green.Render(fmt.Sprintf(" %s",book)) + "\n"
			} else {
				s += blue.Render(fmt.Sprintf("%s %s", " ", book)) + "\n"
			}
		}
	} else {
		s = lipgloss.Place(m.width,m.height,lipgloss.Center,lipgloss.Center,red.Render("Cool Books")) + "\n\n";
	}
	v = tea.NewView(s)
	v.AltScreen = true
	return 
}

func main() {
	prog := tea.NewProgram(InitModel())
	if _,err := prog.Run(); err != nil{
		lipgloss.Println(red.Render("Error"))
		os.Exit(1)
	}
}
