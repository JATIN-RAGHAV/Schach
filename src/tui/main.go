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
	status status

	// Game Type selection page
	game_types []string
	game_type_selected int
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
		status:status_select_game_type,

		// Game Type selection page
		game_types:[]string{
			"Rapid",
			"Blitz",
			"Bullet",
		},
		game_type_selected:0,
	}
}


// This initializes the model
func (m model) Init () tea.Cmd {
	return nil;
}


// This updates the model
func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
		// Get Window size
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height

	case tea.KeyPressMsg:
		// Game Type selection page
		if(m.status == status_select_game_type){
			switch msg.String(){
			case "j":
				if (m.game_type_selected < (len(m.game_types)-1)){
					m.game_type_selected++;
				}
			case "k":
				if (m.game_type_selected > 0){
					m.game_type_selected--;
				}
			case "q","esc":
				return m,tea.Quit
			}
		}

	}
	return m,nil
}

// This renders the model
func (m model) View() (v tea.View) {
	s := "";

	// Game Type selection page
	if(m.status == status_select_game_type){
		s += fmt.Sprintf("%s\n\n",styles_Red.Render("Select a Game Type"))
		for i,val := range m.game_types{
			if i == m.game_type_selected{
				s += fmt.Sprintf("%s %s\n",styles_Red.Render(">"),styles_Green.Render(val))
			}else{
				s += fmt.Sprintf("  %s\n",styles_Blue.Render(val))
			}
		}
	}

	// Put text in center and take control of the whole terminal
	v = tea.NewView(lipgloss.Place(m.width,m.height,lipgloss.Center,lipgloss.Center,s))
	v.AltScreen = true
	return 
}

func main() {
	prog := tea.NewProgram(InitModel())
	if _,err := prog.Run(); err != nil{
		lipgloss.Println(styles_Red.Render("Error"))
		os.Exit(1)
	}
}
