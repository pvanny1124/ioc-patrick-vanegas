import "reflect-metadata";
import { CLASS_INJECTIONS, IS_INJECTABLE, CONTAINER_KEYS } from './constants';

/**
 * IInjection: interface for a class
 */
export interface IInjection extends Function {
  name: string;
}

/**
 * AliasInjection: interface for storing interface or object dependencies
 */
export interface IAliasInjection extends IInjection {
  alias: boolean;
}

/**
 * IoCContainer: class that implements dependency injection and dependency inversion.
 */
export class IoCContainer {
  /**
   * instances: a map of instantiated objects with class names as key-values.
   */
  public instances: { [name: string]: Object } = {};

  /**
   * injectables: an array of classes
   */
  private injectables: Array<IInjection> = [];

  /**
   * aliases: a map to store aliases
   */
  private aliases: { [name: string]: Array<IInjection | IAliasInjection> } = {};

  /**
   * containerKey: a unique identifier for the container
   */
  private containerKey: Symbol;

  constructor() {
    this.containerKey = Symbol();
  }

  /**
   * Type gaurd for IInjection
   * @param {any} object
   */
  instanceOfIInjection(object: any): object is IInjection {
    return 'name' in object;
  }

  /**
   * Registers the class with the container
   * @param {IInjection} injectable the class the user wishes to register with the container.
   * @returns {void}
   */
  public register(injectable: IInjection, alias?: string): void {
    if (this.instanceOfIInjection(injectable)) {
      if (!Reflect.getOwnMetadata(IS_INJECTABLE, injectable)) {
        throw new Error("This class is not injectable. Internal Method [[getOwnMetadata]] returned undefined.");
      }

      if (alias === injectable.name) {
        throw new Error(`Class name must be different from ALIAS`);
      }

      if (alias) {
        this.aliases[alias] = this.aliases[alias] ?  
          [...this.aliases[alias], injectable] : [injectable];
      }
  
      const classContainerKeys = Reflect.getOwnMetadata(CONTAINER_KEYS, injectable);
  
      if (classContainerKeys.find((key: Symbol) => key === this.containerKey)) {
        throw new Error(`Class ${(injectable as IInjection).name} was already assigned to this container.`);
      }
  
      classContainerKeys.push(this.containerKey);
      Reflect.defineMetadata(CONTAINER_KEYS, classContainerKeys, injectable);
      this.injectables = [...this.injectables, injectable];
    }
  }

  /**
   * Returns an instantiated object of the class specified.
   * @param {Function | string} name the name of the class the user wishes to instantiate
   */
  public resolve<T>(name: Function | string): T {
    const classRef = this.getClassRefByName(name);
  
    if (!classRef) {
      throw new Error(`Class "${name}" is not registered in container.`);
    }


    this.instantiate(classRef as (new (...args: any[]) => IInjection));
    return this.instances[classRef.name] as T;
  }

  /**
   * Instantiates an instance of a class with its dependences.
   * @param {new (...args: any[]) => IInjection} Instance the class to be instantiated
   */
  private instantiate(Instance: new (...args: any[]) => IInjection) {
    if (this.getInstance(Instance.name)) {
      console.log("hi")
      return;
    }

    const injects = Reflect.getMetadata(CLASS_INJECTIONS, Instance);

    const dependencies = injects
      .map((injections: any) => {
        if (!injections) {
          throw new Error(`Dependency failed for "${Instance.name}" check for circular dependencies.`)
        }

        return this.resolve<Object>(injections.alias ? injections.name : injections);
      })
      .filter((d: any) => d);
      console.log(...dependencies)
    const instance = new Instance(...dependencies);
    this.addInstance(instance, Instance.name);
  }

  /**
   * Retrieves an instantiated class registered with the container.
   * @param {string} name the name of the class to retrieve.
   * @returns {Object}
   */
  private getInstance(name: string): Object {
    return this.instances[name];
  }

  /**
   * Adds an instance to the container's instance mapping
   * @param {Object} instance the instantiated instance.
   * @param {string} name the name of the instantiated instances class.
   */
  private addInstance(instance: Object, name: string) {
    this.instances[name] = instance;
  }

  /**
   * Returns the name of the class if it exists within the container, otherwise 
   * returns null if it does not.
   * @param {Function} name the name of the class
   * @returns {IInjection}
   */
  private getClassRefByName(name: Function | string): IInjection {
    if (name instanceof Function) {
      const classContainerKeys = Reflect.getOwnMetadata(CONTAINER_KEYS, name);

      if (classContainerKeys.find((c: Symbol) => c === this.containerKey)) {
        return name;
      }
    }
    return null;
  }

  /**
   * Removes the cached instances, aliases, and injectables.
   * @returns {void}
   */
  public dispose(): void {
    this.injectables.length = 0;

    for (const prop of Object.getOwnPropertyNames(this.aliases)) {
      delete this.aliases[prop];
    }

    for (const prop of Object.getOwnPropertyNames(this.instances)) {
      delete this.instances[prop];
    }
  }
}

export const container = new IoCContainer();
