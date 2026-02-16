
type Constructor<T extends object = object> =
// eslint-disable-next-line
new (...args: any[]) => T;
const game = <Tbase extends Constructor>(Base: Tbase) =>
    class extends Base {
        static gamesList;
    };

export default game;
