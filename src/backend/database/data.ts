import Database from './database';
import Memory from './memory';
import Game from './game';

export default class Data extends Game(Memory(Database(class {}))) {}
