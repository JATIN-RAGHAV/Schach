
# DEVELOPMENT

## Date: 2026-02-25

- [x] Fix Special Moves Flags
- - Update flags function wanted the original board to find the piece which was moved, but the board was being updated before the flagsw, and thus the update flag function was finding an empty square and never registering enpassant or any other special move.
- [x] Board not updating correctly in enpassant
- - Make Move function was not checking for en passant
- [x] Game not saving on Database
- - Because the table name was also going in as a placeholder in the query, which is wrong.
- [ ] Test Time Management
- [ ] We getting possible moves which are not possible

### Random Fixes
- En passant was turning out to be invalid, because, the rows were set to [2,5] instead of [3,4] and sRow in [3,4] was being used instead of [3,4].includes(sRow) and getFlags had an object as a key, so changed that to a string, and getFlag returns the flag value, but it was being used to left shif and get the flag.



