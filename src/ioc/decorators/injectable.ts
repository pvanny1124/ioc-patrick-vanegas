import "reflect-metadata";
import { CLASS_INJECTIONS, IS_INJECTABLE, CONTAINER_KEYS } from '../constants';
import { IAliasInjection } from '../container';

/**
 * Decorator to prime a class for injection.
 * @param {Function} constructorFunction 
 */
export function injectable(constructorFunction: Function) {  
  Reflect.defineMetadata(IS_INJECTABLE, true, constructorFunction);
  Reflect.defineMetadata(CONTAINER_KEYS, [], constructorFunction);

  if (!Reflect.getOwnMetadata(CLASS_INJECTIONS, constructorFunction)) {
    Reflect.defineMetadata(CLASS_INJECTIONS, [], constructorFunction);
  }
}

/**
 * Decorator to get constructor dependencies
 * @param {string} alias 
 */
export function dep(alias?: string) {
  return function(
    target: Function,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    if (propertyKey) {
      throw new Error('dep() should only be used in constructor arguments');
    }

    const aliasInjection = { name: alias, alias: true } as IAliasInjection;
    const inject = alias ? aliasInjection : Reflect.getMetadata('design:paramtypes', target)[parameterIndex];

    if (inject && Reflect.has(inject, 'isExtensible')) {
      throw new Error(`You can't inject interfaces or objects without an alias`);
    }

    let injects = Reflect.getOwnMetadata(CLASS_INJECTIONS, target) || [];
    injects[parameterIndex] = inject;
    Reflect.defineMetadata(CLASS_INJECTIONS, injects, target);
  }
}
