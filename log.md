
# DEVELOPMENT

## Date: 2026-02-25

- [x] Fix Special Moves Flags
- - Update flags function wanted the original board to find the piece which was moved, but the board was being updated before the flagsw, and thus the update flag function was finding an empty square and never registering enpassant or any other special move.
- [x] Board not updating correctly in enpassant
- - Make Move function was not checking for en passant
- [ ] Game not saving on Database
- [ ] Test Time Management

### Random Fixes
- 
