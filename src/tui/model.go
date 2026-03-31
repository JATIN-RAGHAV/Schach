package main

import (
	"fmt"

	tea "charm.land/bubbletea/v2"
	lipgloss "charm.land/lipgloss/v2"
	websocket "github.com/gorilla/websocket"
)

type model struct {
	width int
	height int
	status status

	// Game Type selection page
	game_types []string
	game_type_selected int

	// Game Play Page
	gameStruct gameStruct
	move string
	socket *websocket.Conn

	// Game End Page
	winner bool
	whyOver string

	// Debug
	message []byte
}


// The state of the App, called model
func InitModel () model {
	return model {
		width:0,
		height:0,
		status:status_select_game_type,

		// Game Type selection page
		game_types:[]string{
			Rapid,
			Blitz,
			Bullet,
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
	
	case updateModelTeaMessage:
        return msg.model, nil

	// Get Window size
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height

	case tea.KeyPressMsg:

		if(msg.String() == "q" || msg.String() == "esc"){
			closeSocket();
			fmt.Printf("Quitting");
			return m, tea.Quit
		}

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
			case "enter":
				openSocket()
				go startSocket(&m);
			}
		}

		// Game Loading Page, nothing updates

		// Game Active Page
		if(m.status == status_play){
			switch msg.String(){
			case "a","b","c","d","e","f","g","h","1","2","3","4","5","6","7","8":
				m.move += msg.String();
			case "backspace":
				if(len(m.move) > 0){
					m.move = m.move[:len(m.move)-1]
				}
			case "enter":
				sendMove(m.move,m.socket)
			}
		}

		// End Game Page
		if(m.status == status_end_game){
			switch msg.String(){
			case "r","R","enter":
				m.status = status_select_game_type
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

	// Game Loading page
	if(m.status == status_loading){
		s += fmt.Sprintf("%s\n\n",styles_Red.Render("Loading Game..."))
	}

	// Game Active Page
	if(m.status == status_play){
		var color color;
		if((m.gameStruct.moveNumber % 2) == 1){
			color = Black
		}else{
			color = White
		}
		s += fmt.Sprintf("Playing as: %s\n\n",m.gameStruct.color)

		s += printBoard(m.gameStruct.board,m.gameStruct.color);

		if(color == m.gameStruct.color){
			s += fmt.Sprintf("%s: ",styles_Blue.Render("Your Turn"))
			s += m.move + "\n\n";
		}else{
			s += fmt.Sprintf("%s\n\n",styles_Red.Render("Opponent's Turn"))
		}
		
	}

	// Game End Page
	if(m.status == status_end_game){
	
		msg := ""
		if(m.winner){
			msg = styles_Green.Render("You Won!!")
		}else{
			msg = styles_Red.Render("You lost")
		}

		s += fmt.Sprintf("%s\n\n",styles_Blue.Render("Game Over"))
		s += fmt.Sprintf("%s\n\n",msg)
	}

	// s += string(m.message)

	// Put text in center and take control of the whole terminal
	v = tea.NewView(lipgloss.Place(m.width,m.height,lipgloss.Center,lipgloss.Center,s))
	v.AltScreen = true
	return 
}
