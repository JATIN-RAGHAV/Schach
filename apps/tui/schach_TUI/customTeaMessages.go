package schach_TUI;

type updateModelTeaMessage struct{
	model model
}

type updateMessageTeaMessage struct {
	message int
}

type updateTimeTeaMessage struct {
	whiteTimeLeft int
    blackTimeLeft int
}
