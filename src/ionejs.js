//Namespace
export * from './genesis/index.js';
export * from './core/index.js';
export * from './geom/index.js';

import { creator, definer, register } from './helpers/index.js';
import { One } from './core/index.js';

register.Ones['One'] = One;
creator.defaultAlias = 'One';

export var create = creator.create.bind(creator);
export var define = definer.define.bind(definer);
export var defineOne = definer.defineOne.bind(definer);
export var defineAction = definer.defineAction.bind(definer);
export var defineEvent = definer.defineEvent.bind(definer);
export var defineTemplate = definer.defineTemplate.bind(definer);
export var damping = damping;
