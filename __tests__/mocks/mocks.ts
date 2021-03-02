import { injectable } from '../../src/ioc/decorators/injectable';

export class NotInjectable {}

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

