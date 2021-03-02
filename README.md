## Requirements

Write a simple IoC library in either Typescript or JavaScript (your choice; we use Typescript). We are not looking for a feature-complete solution - for example, it is okay to support only transient objects and classes (no constants, functions, and other types). You will not be evaluated based on the number of features you implement; instead, we are interested to see where you place your priorities when time is limited, and what you do when you know bits are missing, such as support for circular dependencies. We recommend scoping yourself to around two hours, as this best allows you to showcase the choices you make. Your solution should exemplify what you value in a good library that can actively be used by other projects, and further developed by a team (which could include junior developers). Please submit it as a GitHub repository. We are interested to see:

- The steps you take to make the library great to use
- How you set up the code for further collaborative development
- Your approach to testing
- How you deal with feature gaps and edge cases

## Fundamentals

**Inversion of Control (IoC)** is a design principle that is implemented based on the Dependency Injection (DI) and Dependency Inversion Principle (DIP) principles.

A **Dependency** is an object or unit of software that is consumed by a client program. For instance, a dependency could be a service that returns information that must be represented in a client.

A **Dependency Injection** is a design pattern where an Object receives other objects that it depends on to perform a specific operation, thereby allowing the class to be independent of its dependencies.

There are two rules that must satisfy the **Dependency Inversion Principle**:
- The higher level modules must not depend on implementatinos of lower level modules.
- Abstractions do not depend on the details, but the details depend on abstractions.

An **IoC container** is a framework used to create an object of a specified class and injects all the dependency objects through a constructor, a property or a method at run time, and disposes it at a later point in time. In other words, it is a framework for implementing automatic dependency injection.

Therefore, an **IoC library** implements the above principles and handles both dependency injection and class instatiation and keeps code modular and clean.

There are three main lifecycle methods that an IoC container must provide:

1. **Register ("Registration")**
  - The container must know which dependency to instatiate when it sees a type.
  - Hence, the container must have a type-mapping mechanism for registering dependencies.

2. **Resolve ("Resolution")**
  - The container creates objects of a specified type for a user.
  - The container has methods to resolve a specified type
  - The container injects the required dependencies for the object and returns the object

3. **Dispose**
  - The Container must manage lifetime of dependent objects.

For the purposes of this task, we focus on storing classes and constructor dependencies.

## Getting Started

```
npm i ioc-patrick-vanegas
```

```
import { container, injectable, dep } from 'ioc-patrick-vanegas'
```

Examples in your code:

```
@injectable
export class A {
  sum(a: number, b: number) {
    return a + b;
  }
}


@injectable
export class B {
  sum(a: number, b: number) {
    return a + b;
  }
}

@injectable
class C {
  constructor() {}

  printf(): string {
    return 'SOME OTHER CLASS INSTANCE';
  }
}

@injectable
class D {
  constructor() {}

  printf(): string {
    return 'SOME OTHER CLASS INSTANCE';
  }
}

@injectable
class E {
  constructor(@dep() public some: C, @dep() public another: D) {}
}


interface AliasInterface {
  printf(): string;
}

@injectable
class F {
  constructor(@dep("FOO_BAR") public some: AliasInterface) {}

  printf(): string {
    return 'SOME OTHER CLASS INSTANCE';
  }
}

container.register(A);
container.register(B);
container.register(E);
container.register(C);
container.register(D);
container.register(F)



let classA = container.resolve<A>(A);
let classB = container.resolve<A>(B);

classA.sum(2, 3); // 5
classB.sum(5, 5); // 10

const subject = container.resolve<E>(E);
subject.some.printf();

container.dispose();
```

TODO: optimize dispose method and remove metadata
TODO: add support for injecting instance fields
TODO: add support for multiple mappings of the same type


Resources used:

1. https://medium.com/monstar-lab-bangladesh-engineering/simplifying-dependency-injection-and-ioc-concepts-using-typescript-b70643f71c91
2. https://www.tutorialsteacher.com/ioc
3. https://medium.com/jspoint/introduction-to-reflect-metadata-package-and-its-ecmascript-proposal-8798405d7d88
4. https://github.com/eliasdarruda/ts-di-container
